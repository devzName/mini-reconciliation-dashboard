import { createPool } from './db';

async function resetDatabase(): Promise<void> {
  const pool = createPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query(`
      DROP TABLE IF EXISTS income CASCADE;
      DROP TABLE IF EXISTS orders CASCADE;
      DROP TABLE IF EXISTS schema_migrations CASCADE;
    `);
    await client.query('COMMIT');

    console.log('Dropped income, orders, and schema_migrations tables');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

void resetDatabase().catch((error) => {
  console.error(error);
  process.exit(1);
});
