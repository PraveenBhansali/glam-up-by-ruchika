-- Create bookings table for Glam Up by Ruchika
CREATE TABLE bookings (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  service TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  notes TEXT,
  estimated_people INTEGER DEFAULT 1,
  service_price INTEGER DEFAULT 0,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled'))
);

-- Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can make this more restrictive later)
CREATE POLICY "Allow all operations on bookings" ON bookings
FOR ALL USING (true) WITH CHECK (true);

-- Create an index on date for faster queries
CREATE INDEX idx_bookings_date ON bookings(date);

-- Create an index on status for faster filtering
CREATE INDEX idx_bookings_status ON bookings(status);
