import { existsSync } from 'fs';
import * as path from 'path';

import { PoolClient } from 'pg';
import * as XLSX from 'xlsx';

import { createPool } from './db';

type Row = Record<string, string | number | Date | null | undefined>;

function readRows(filePath: string): Row[] {
  const workbook = XLSX.readFile(filePath, { cellDates: false });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  return XLSX.utils.sheet_to_json<Row>(sheet, { defval: null });
}

function excelDateToIsoDate(value: string | number | Date | null | undefined): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === 'number') {
    const date = new Date(Math.round((value - 25569) * 86400 * 1000));
    return date.toISOString().slice(0, 10);
  }

  if (typeof value === 'string' && value.trim()) {
    const numericValue = Number(value);
    if (!Number.isNaN(numericValue)) {
      return excelDateToIsoDate(numericValue);
    }

    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString().slice(0, 10);
    }
  }

  throw new Error(`Invalid date value: ${String(value)}`);
}

function asString(value: Row[string], field: string): string {
  if (value === null || value === undefined || value === '') {
    throw new Error(`${field} is required`);
  }

  return String(value).trim();
}

function asInteger(value: Row[string], field: string): number {
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  const numberValue = Number(value);
  if (!Number.isInteger(numberValue)) {
    throw new Error(`${field} must be an integer VND amount`);
  }

  return numberValue;
}

async function importOrders(client: PoolClient, filePath: string): Promise<number> {
  const rows = readRows(filePath);

  for (const row of rows) {
    await client.query(
      `
        INSERT INTO orders (
          order_code,
          platform,
          status,
          product_price,
          order_date,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, NOW())
        ON CONFLICT (order_code)
        DO UPDATE SET
          platform = EXCLUDED.platform,
          status = EXCLUDED.status,
          product_price = EXCLUDED.product_price,
          order_date = EXCLUDED.order_date,
          updated_at = NOW()
      `,
      [
        asString(row.order_code, 'order_code'),
        asString(row.platform, 'platform'),
        asString(row.status, 'status'),
        asInteger(row.product_price, 'product_price'),
        excelDateToIsoDate(row.order_date),
      ],
    );
  }

  return rows.length;
}

async function importIncome(client: PoolClient, filePath: string): Promise<number> {
  const rows = readRows(filePath);
  let insertedCount = 0;

  await client.query('TRUNCATE TABLE income RESTART IDENTITY');

  for (const [index, row] of rows.entries()) {
    const grossRevenue = asInteger(row.gross_revenue, 'gross_revenue');
    const refundAmount = asInteger(row.refund_amount, 'refund_amount');
    const feeTotal = asInteger(row.fee_total, 'fee_total');
    const netReceived = asInteger(row.net_received, 'net_received');

    if (netReceived !== grossRevenue + refundAmount + feeTotal) {
      throw new Error(
        `Invalid net_received at ${path.basename(filePath)} row ${index + 2}`,
      );
    }

    const result = await client.query(
      `
        INSERT INTO income (
          order_code,
          settlement_date,
          gross_revenue,
          refund_amount,
          fee_total,
          net_received,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        ON CONFLICT (order_code) DO NOTHING
      `,
      [
        asString(row.order_code, 'order_code'),
        excelDateToIsoDate(row.settlement_date),
        grossRevenue,
        refundAmount,
        feeTotal,
        netReceived,
      ],
    );
    insertedCount += result.rowCount ?? 0;
  }

  return insertedCount;
}

function resolveDataFile(dataDir: string, baseName: string): string {
  const csvPath = path.join(dataDir, `${baseName}.csv`);
  const xlsxPath = path.join(dataDir, `${baseName}.xlsx`);

  if (existsSync(csvPath)) {
    return csvPath;
  }

  if (existsSync(xlsxPath)) {
    return xlsxPath;
  }

  throw new Error(`Missing ${baseName}.csv or ${baseName}.xlsx`);
}

async function importExcel(): Promise<void> {
  const pool = createPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const dataDir = path.resolve(__dirname, 'data');
    const orderCount = await importOrders(client, resolveDataFile(dataDir, 'orders'));
    const incomeCount = await importIncome(client, resolveDataFile(dataDir, 'income'));

    await client.query('COMMIT');

    console.log(`Imported ${orderCount} orders`);
    console.log(`Imported ${incomeCount} income rows`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

void importExcel().catch((error) => {
  console.error(error);
  process.exit(1);
});
