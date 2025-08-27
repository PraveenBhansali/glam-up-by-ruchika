import { createClient } from '@supabase/supabase-js'

// These will be your actual Supabase project credentials
// You'll get these when you create a Supabase project
const supabaseUrl = 'https://your-project.supabase.co'
const supabaseKey = 'your-anon-key-here'

export const supabase = createClient(supabaseUrl, supabaseKey)
