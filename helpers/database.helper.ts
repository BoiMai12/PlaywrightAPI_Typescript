
import { Pool } from 'pg';

export const db = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

export async function getProductByIdinDB(productId: number) {
  const result = await db.query(
    'SELECT * FROM products WHERE id = $1',
    [productId]
  );

  return result.rows[0];
}
