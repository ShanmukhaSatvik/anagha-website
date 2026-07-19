import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

/** Key/value CMS blobs (hero, header, offers, plans, etc.) */
export const siteContent = pgTable('site_content', {
  key: text('key').primaryKey(),
  data: jsonb('data').default({}),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const jewelleryCategories = pgTable('jewellery_categories', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  image: text('image'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  category: text('category').notNull(),
  subcategory: text('subcategory'),
  name: text('name').notNull(),
  price: text('price').notNull(),
  originalPrice: text('original_price'),
  image: text('image'),
  description: text('description'),
  offer: text('offer'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Website checkout sessions (ERP customer created only after paid). */
export const checkoutSessions = pgTable('checkout_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  status: text('status').notNull().default('pending'),
  tagNumber: text('tag_number').notNull(),
  inventoryId: text('inventory_id'),
  amount: text('amount').notNull(),
  currency: text('currency').notNull().default('INR'),
  customerName: text('customer_name'),
  customerMobile: text('customer_mobile'),
  customerEmail: text('customer_email'),
  phonepeMerchantTxnId: text('phonepe_merchant_txn_id'),
  phonepeTxnId: text('phonepe_txn_id'),
  erpBillId: text('erp_bill_id'),
  erpBillNumber: text('erp_bill_number'),
  paymentPayload: jsonb('payment_payload').default({}),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
