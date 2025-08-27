-- Create services table for Glam Up by Ruchika
CREATE TABLE services (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  client_price INTEGER NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Create workers table for Glam Up by Ruchika  
CREATE TABLE workers (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  payment_rate INTEGER DEFAULT 0,
  is_owner BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true
);

-- Enable Row Level Security (RLS) for both tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (you can make this more restrictive later)
CREATE POLICY "Allow all operations on services" ON services
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on workers" ON workers  
FOR ALL USING (true) WITH CHECK (true);

-- Insert default services
INSERT INTO services (name, client_price, description) VALUES
('Bridal Makeup', 3500, 'Complete bridal transformation with HD makeup ✨'),
('Non-Bridal Makeup', 2000, 'Beautiful makeup for parties and events 💄'),
('Pre-Wedding Makeup', 2800, 'Perfect look for engagement and pre-wedding shoots 📸'),
('Simple Makeup', 1800, 'Elegant everyday makeup for any occasion ✨'),
('Saree Draping', 1200, 'Traditional saree draping with styling 🥻');

-- Insert default workers
INSERT INTO workers (name, role, payment_rate, is_owner) VALUES
('Ruchika Bhansali', 'Certified Makeup Artist', 0, true),
('Assistant', 'Makeup Assistant', 800, false);

-- Create indexes for better performance
CREATE INDEX idx_services_active ON services(is_active);
CREATE INDEX idx_workers_active ON workers(is_active);
