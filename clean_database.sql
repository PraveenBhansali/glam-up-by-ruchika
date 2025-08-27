-- CLEAN DATABASE COMMANDS
-- Run these in your Supabase SQL Editor to delete all data

-- 1. Delete all booking details (completion data)
DELETE FROM booking_details;

-- 2. Delete all bookings
DELETE FROM bookings;

-- 3. Delete all services (optional - will reset to defaults)
DELETE FROM services;

-- 4. Delete all workers (optional - will reset to defaults)  
DELETE FROM workers;

-- 5. Reset auto-increment sequences (optional)
ALTER SEQUENCE bookings_id_seq RESTART WITH 1;
ALTER SEQUENCE booking_details_id_seq RESTART WITH 1;
ALTER SEQUENCE services_id_seq RESTART WITH 1;
ALTER SEQUENCE workers_id_seq RESTART WITH 1;

-- 6. Verify all tables are empty
SELECT 'bookings' as table_name, COUNT(*) as count FROM bookings
UNION ALL
SELECT 'booking_details' as table_name, COUNT(*) as count FROM booking_details
UNION ALL  
SELECT 'services' as table_name, COUNT(*) as count FROM services
UNION ALL
SELECT 'workers' as table_name, COUNT(*) as count FROM workers;
