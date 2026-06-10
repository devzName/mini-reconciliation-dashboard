CREATE TABLE IF NOT EXISTS orders (
  order_code TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'cancelled')),
  product_price INTEGER NOT NULL DEFAULT 0 CHECK (product_price >= 0),
  order_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS income (
  id BIGSERIAL PRIMARY KEY,
  order_code TEXT NOT NULL UNIQUE,
  settlement_date DATE NOT NULL,
  gross_revenue INTEGER NOT NULL DEFAULT 0,
  refund_amount INTEGER NOT NULL DEFAULT 0,
  fee_total INTEGER NOT NULL DEFAULT 0,
  net_received INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT income_net_received_matches_components
    CHECK (net_received = gross_revenue + refund_amount + fee_total)
);

CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders (order_date);
CREATE INDEX IF NOT EXISTS idx_orders_platform_status ON orders (platform, status);
CREATE INDEX IF NOT EXISTS idx_income_settlement_date ON income (settlement_date);
