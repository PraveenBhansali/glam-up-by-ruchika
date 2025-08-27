-- Create booking_details table for completion information
-- Run this in your Supabase SQL Editor

CREATE TABLE booking_details (
  id BIGSERIAL PRIMARY KEY,
  booking_id BIGINT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Payment Information
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'completed')),
  payment_amount INTEGER DEFAULT 0,
  payment_method TEXT, -- cash, upi, bank_transfer, etc.
  payment_notes TEXT,
  
  -- Service Details
  actual_people INTEGER,
  actual_duration INTEGER, -- in minutes
  services_provided TEXT[], -- array of services actually provided
  additional_services TEXT,
  
  -- Completion Information
  completion_notes TEXT,
  client_feedback TEXT,
  client_rating INTEGER CHECK (client_rating >= 1 AND client_rating <= 5),
  
  -- Media & Documentation
  photos_uploaded BOOLEAN DEFAULT false,
  photo_urls TEXT[], -- array of photo URLs
  before_after_photos BOOLEAN DEFAULT false,
  
  -- Worker Information
  workers_involved TEXT[], -- array of worker names/ids
  worker_payments JSONB, -- {"worker_id": amount, ...}
  
  -- Business Metrics
  profit_margin INTEGER, -- calculated profit
  travel_distance INTEGER, -- in km
  travel_cost INTEGER,
  product_cost INTEGER, -- cost of makeup products used
  
  -- Follow-up
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  follow_up_notes TEXT,
  
  -- Unique constraint to ensure one detail record per booking
  UNIQUE(booking_id)
);

-- Enable Row Level Security
ALTER TABLE booking_details ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can make this more restrictive later)
CREATE POLICY "Allow all operations on booking_details" ON booking_details
FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_booking_details_booking_id ON booking_details(booking_id);
CREATE INDEX idx_booking_details_payment_status ON booking_details(payment_status);
CREATE INDEX idx_booking_details_created_at ON booking_details(created_at);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_booking_details_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_booking_details_updated_at
    BEFORE UPDATE ON booking_details
    FOR EACH ROW
    EXECUTE FUNCTION update_booking_details_updated_at();

-- Add comments for documentation
COMMENT ON TABLE booking_details IS 'Detailed completion information for bookings';
COMMENT ON COLUMN booking_details.booking_id IS 'Reference to the main booking record';
COMMENT ON COLUMN booking_details.payment_status IS 'Payment status: pending, partial, completed';
COMMENT ON COLUMN booking_details.actual_people IS 'Actual number of people served';
COMMENT ON COLUMN booking_details.services_provided IS 'Array of services actually provided';
COMMENT ON COLUMN booking_details.worker_payments IS 'JSON object with worker payment details';
COMMENT ON COLUMN booking_details.profit_margin IS 'Calculated profit after all expenses';
