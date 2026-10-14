CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  platform TEXT,
  reference TEXT,
  supplier_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE calculations (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products (id) ON DELETE SET NULL,
  product_cost NUMERIC(12, 2) NOT NULL,
  shipping_cost NUMERIC(12, 2) NOT NULL,
  dropi_commission NUMERIC(12, 2) NOT NULL DEFAULT 0,
  estimated_cpa NUMERIC(12, 2) NOT NULL DEFAULT 0,
  profit_margin NUMERIC(5, 2) NOT NULL DEFAULT 30,
  order_count INTEGER NOT NULL DEFAULT 1,
  total_cost NUMERIC(12, 2) NOT NULL,
  ideal_sale_price NUMERIC(12, 2) NOT NULL,
  ideal_sale_price_two_units NUMERIC(12, 2) NOT NULL,
  ideal_sale_price_three_units NUMERIC(12, 2) NOT NULL,
  profit_per_sale NUMERIC(12, 2) NOT NULL,
  profit_percentage NUMERIC(7, 2) NOT NULL,
  required_roas NUMERIC(10, 2) NOT NULL,
  total_billing NUMERIC(12, 2) NOT NULL,
  total_profit NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE product_scores (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products (id) ON DELETE CASCADE,
  wow_effect BOOLEAN NOT NULL DEFAULT false,
  catchy_launch BOOLEAN NOT NULL DEFAULT false,
  high_value_perception BOOLEAN NOT NULL DEFAULT false,
  needs_fulfilled BOOLEAN NOT NULL DEFAULT false,
  can_import BOOLEAN NOT NULL DEFAULT false,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_calculations_product_id ON calculations (product_id);
CREATE INDEX idx_product_scores_product_id ON product_scores (product_id);
