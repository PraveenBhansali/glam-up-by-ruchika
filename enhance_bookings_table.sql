-- Enhance bookings table with additional fields for better tracking
-- Run this in your Supabase SQL Editor

-- Add new columns for better booking management
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'completed'));
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_amount INTEGER DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS actual_people INTEGER;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS completion_notes TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS photos_uploaded BOOLEAN DEFAULT false;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS client_rating INTEGER CHECK (client_rating >= 1 AND client_rating <= 5);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_bookings_status_date ON bookings(status, date);
CREATE INDEX IF NOT EXISTS idx_bookings_updated_at ON bookings(updated_at);

-- Add comments for documentation
COMMENT ON COLUMN bookings.payment_status IS 'Payment status: pending, partial, completed';
COMMENT ON COLUMN bookings.payment_amount IS 'Actual amount received from client';
COMMENT ON COLUMN bookings.actual_people IS 'Actual number of people served (may differ from estimated)';
COMMENT ON COLUMN bookings.completion_notes IS 'Additional notes after completing the service';
COMMENT ON COLUMN bookings.photos_uploaded IS 'Whether photos of the work have been uploaded';
COMMENT ON COLUMN bookings.client_rating IS 'Client satisfaction rating (1-5 stars)';
COMMENT ON COLUMN bookings.updated_at IS 'Timestamp of last update';
