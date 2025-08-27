import { createClient } from '@supabase/supabase-js'

// Supabase project credentials for Glam Up by Ruchika
const supabaseUrl = 'https://abtmmnbpwmcwvjwagzel.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFidG1tbmJwd21jd3Zqd2FnemVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyOTYxOTIsImV4cCI6MjA3MTg3MjE5Mn0.ZhPuve2ncl6LrH-bZhDfOSOLgkAKmIO_zrHbe-BdpQs'

export const supabase = createClient(supabaseUrl, supabaseKey)
