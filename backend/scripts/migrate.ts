import { promises as fs } from 'fs';
import * as path from 'path';

import { Pool } from 'pg';

import { createPool } from './db';

function quoteIdentifier(identifier: string): string {
  return `"${identifier.replace(/"/g, '""')}"`;
}

async function ensureDatabaseExists(): Promise<void> {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is required');
  }

  const targetUrl = new URL(connectionString);
  const databaseName = decodeURIComponent(targetUrl.pathname.replace(/^\//, ''));

  if (!databaseName) {
    throw new Error('DATABASE_URL must include a database name');
  }

  const adminUrl = new URL(targetUrl.toString());
  adminUrl.pathname = '/postgres';

  const adminPool = new Pool({ connectionString: adminUrl.toString() });
  const adminClient = await adminPool.connect();

  try {
    const exists = await adminClient.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [databaseName],
    );

    if (!exists.rowCount) {
      await adminClient.query(`CREATE DATABASE ${quoteIdentifier(databaseName)}`);
      console.log(`Created database: ${databaseName}`);
    }
  } finally {
    adminClient.release();
    await adminPool.end();
  }
}

async function migrate(): Promise<void> {
  await ensureDatabaseExists();

  const pool = createPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const migrationsDir = path.resolve(__dirname, '..', 'migrations');
    const files = (await fs.readdir(migrationsDir))
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const exists = await client.query(
        'SELECT 1 FROM schema_migrations WHERE filename = $1',
        [file],
      );

      if (exists.rowCount) {
        continue;
      }

      const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [
        file,
      ]);
      console.log(`Applied migration: ${file}`);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

void migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
