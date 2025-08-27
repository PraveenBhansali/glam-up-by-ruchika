-- Create booking_members table for detailed member information
-- Run this in your Supabase SQL Editor

CREATE TABLE booking_members (
  id BIGSERIAL PRIMARY KEY,
  booking_id BIGINT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Member Information
  member_name TEXT NOT NULL,
  member_relation TEXT, -- bride, sister, mother, friend, etc.
  member_age INTEGER,
  
  -- Service Details
  service_provided TEXT NOT NULL, -- Bridal Makeup, Simple Makeup, etc.
  service_price INTEGER DEFAULT 0,
  worker_assigned TEXT, -- who performed the service
  
  -- Occasion & Context
  occasion TEXT, -- wedding, engagement, party, etc.
  occasion_date DATE,
  occasion_time TIME,
  
  -- Service Specifics
  makeup_type TEXT, -- HD, Regular, Airbrush, etc.
  additional_services TEXT[], -- hair styling, saree draping, etc.
  products_used TEXT[], -- specific products/brands used
  
  -- Timing
  service_start_time TIME,
  service_end_time TIME,
  service_duration INTEGER, -- in minutes
  
  -- Quality & Satisfaction
  member_satisfaction INTEGER CHECK (member_satisfaction >= 1 AND member_satisfaction <= 5),
  member_feedback TEXT,
  special_requests TEXT,
  
  -- Photos & Documentation
  before_photo_url TEXT,
  after_photo_url TEXT,
  process_photos TEXT[], -- array of photo URLs during service
  
  -- Business Metrics
  cost_breakdown JSONB, -- {"products": 200, "time": 300, "travel": 100}
  profit_margin INTEGER,
  
  -- Notes
  service_notes TEXT, -- internal notes about the service
  member_notes TEXT, -- notes about the member's preferences
  
  -- Follow-up
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_notes TEXT
);

-- Enable Row Level Security
ALTER TABLE booking_members ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on booking_members" ON booking_members
FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_booking_members_booking_id ON booking_members(booking_id);
CREATE INDEX idx_booking_members_service ON booking_members(service_provided);
CREATE INDEX idx_booking_members_worker ON booking_members(worker_assigned);
CREATE INDEX idx_booking_members_occasion ON booking_members(occasion);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_booking_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_booking_members_updated_at
    BEFORE UPDATE ON booking_members
    FOR EACH ROW
    EXECUTE FUNCTION update_booking_members_updated_at();

-- Add comments for documentation
COMMENT ON TABLE booking_members IS 'Detailed information for each member served in a booking';
COMMENT ON COLUMN booking_members.member_relation IS 'Relationship to main client (bride, sister, mother, friend, etc.)';
COMMENT ON COLUMN booking_members.service_provided IS 'Specific service provided to this member';
COMMENT ON COLUMN booking_members.worker_assigned IS 'Worker who performed the service';
COMMENT ON COLUMN booking_members.occasion IS 'Type of occasion (wedding, engagement, party, etc.)';
COMMENT ON COLUMN booking_members.cost_breakdown IS 'JSON breakdown of costs for this member';
COMMENT ON COLUMN booking_members.member_satisfaction IS 'Member satisfaction rating (1-5 stars)';
