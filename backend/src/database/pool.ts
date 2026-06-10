import 'dotenv/config';

import { Pool, QueryResult, QueryResultRow } from 'pg';

let pool: Pool | undefined;

function getPool(): Pool {
  if (pool) {
    return pool;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL is required');
  }

  pool = new Pool({ connectionString });

  return pool;
}

export function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  values?: unknown[],
): Promise<QueryResult<T>> {
  return getPool().query<T>(text, values);
}
