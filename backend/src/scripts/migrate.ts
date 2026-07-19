import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
  }

  const sql = neon(process.env.DATABASE_URL);

  await sql`
    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      data JSONB DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // Allow null CMS values (e.g. standaloneBanner)
  await sql`ALTER TABLE site_content ALTER COLUMN data DROP NOT NULL`;

  await sql`
    CREATE TABLE IF NOT EXISTS jewellery_categories (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      name TEXT NOT NULL,
      image TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      category TEXT NOT NULL,
      subcategory TEXT,
      name TEXT NOT NULL,
      price TEXT NOT NULL,
      original_price TEXT,
      image TEXT,
      description TEXT,
      offer TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS products_category_idx ON products (category)`;

  await sql`
    CREATE TABLE IF NOT EXISTS checkout_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      status TEXT NOT NULL DEFAULT 'pending',
      tag_number TEXT NOT NULL,
      inventory_id TEXT,
      amount TEXT NOT NULL,
      currency TEXT NOT NULL DEFAULT 'INR',
      customer_name TEXT,
      customer_mobile TEXT,
      customer_email TEXT,
      phonepe_merchant_txn_id TEXT,
      phonepe_txn_id TEXT,
      erp_bill_id TEXT,
      erp_bill_number TEXT,
      payment_payload JSONB DEFAULT '{}'::jsonb,
      expires_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS checkout_sessions_status_idx ON checkout_sessions (status)`;
  await sql`CREATE INDEX IF NOT EXISTS checkout_sessions_merchant_txn_idx ON checkout_sessions (phonepe_merchant_txn_id)`;

  console.log('Migration complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
