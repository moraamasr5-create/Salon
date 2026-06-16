-- Supabase schema for Salon
-- Requires the "pgcrypto" extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Sequence for ticket numbers
CREATE SEQUENCE IF NOT EXISTS ticket_seq START 1;

-- customers
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text UNIQUE NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- services
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text,
  price numeric(10,2) DEFAULT 0,
  duration_minutes int DEFAULT 0,
  tips text,
  created_at timestamptz DEFAULT now()
);

-- employees
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  created_at timestamptz DEFAULT now()
);

-- visits
CREATE TABLE IF NOT EXISTS visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'created',
  services jsonb DEFAULT '[]'::jsonb,
  employee_id uuid REFERENCES employees(id),
  notes text
);

-- queue: ticket_code is generated from ticket_seq with prefix A and zero-padded
CREATE FUNCTION IF NOT EXISTS gen_ticket_code() RETURNS text LANGUAGE sql AS $$
  SELECT 'A' || lpad(nextval('ticket_seq')::text, 3, '0');
$$;

CREATE TABLE IF NOT EXISTS queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_code text UNIQUE DEFAULT gen_ticket_code(),
  visit_id uuid REFERENCES visits(id) ON DELETE CASCADE,
  position int,
  status text DEFAULT 'waiting', -- waiting, serving, completed, canceled
  created_at timestamptz DEFAULT now()
);

ALTER TABLE IF EXISTS queue
ADD COLUMN IF NOT EXISTS started_at timestamptz,
ADD COLUMN IF NOT EXISTS completed_at timestamptz;

-- reminder flag for queue items to avoid duplicate notifications
ALTER TABLE IF EXISTS queue
ADD COLUMN IF NOT EXISTS reminder_sent boolean DEFAULT false;

-- orders/payments
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id uuid REFERENCES visits(id) ON DELETE CASCADE,
  total numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  amount numeric(10,2) DEFAULT 0,
  method text,
  created_at timestamptz DEFAULT now()
);

-- reviews
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id uuid REFERENCES visits(id) ON DELETE CASCADE,
  rating int CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- sessions (temporary client session links)
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_code text UNIQUE,
  data jsonb DEFAULT '{}'::jsonb,
  expires_at timestamptz
);


-- service_logs: track each service instance timing and employee assignment
CREATE TABLE IF NOT EXISTS service_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id uuid REFERENCES visits(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id),
  service_instance_id uuid, -- matches the id inside visits.services element
  employee_id uuid REFERENCES employees(id),
  started_at timestamptz,
  completed_at timestamptz,
  duration_seconds int,
  created_at timestamptz DEFAULT now()
);

-- Basic indexes
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_queue_status_created ON queue(status, created_at);

-- NOTE: Enable Row Level Security (RLS) and create appropriate policies in Supabase dashboard
-- Example (development):
-- ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow anon read" ON customers FOR SELECT USING (true);
