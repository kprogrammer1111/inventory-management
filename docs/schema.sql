
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS inventory_batches (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(50) REFERENCES products(product_id),
  quantity INT NOT NULL,
  unit_price NUMERIC NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS sales (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(50) REFERENCES products(product_id),
  quantity INT NOT NULL,
  total_cost NUMERIC NOT NULL,
  cost_per_unit NUMERIC NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
