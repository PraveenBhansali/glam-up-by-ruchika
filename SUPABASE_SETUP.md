# 🚀 Supabase Setup Guide for Glam Up by Ruchika

## Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Create a new organization if prompted

## Step 2: Create New Project
1. Click "New Project"
2. Choose your organization
3. Project details:
   - **Name**: `glam-up-by-ruchika`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location
4. Click "Create new project"
5. Wait for project to be ready (2-3 minutes)

## Step 3: Get Project Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Step 4: Create Database Table
1. Go to **Table Editor** in your Supabase dashboard
2. Click "Create a new table"
3. Table name: `bookings`
4. Add these columns:

| Column Name | Type | Default Value | Extra |
|-------------|------|---------------|-------|
| id | int8 | | Primary, Auto-increment |
| created_at | timestamptz | now() | |
| name | text | | |
| email | text | | |
| phone | text | | |
| service | text | | |
| date | date | | |
| time | time | | |
| notes | text | | |
| status | text | 'upcoming' | |

5. Click "Save"

## Step 5: Update Configuration
1. Open `src/supabase.js`
2. Replace the placeholder values:
   ```javascript
   const supabaseUrl = 'YOUR_PROJECT_URL_HERE'
   const supabaseKey = 'YOUR_ANON_KEY_HERE'
   ```

## Step 6: Test the Connection
1. Run `npm run dev`
2. Try creating a new booking
3. Check your Supabase dashboard → Table Editor → bookings to see if data appears

## 🎉 You're all set!
Your app will now store all booking data online in Supabase, accessible from any device!

## 📱 Mobile Access
Once deployed to GitHub Pages, you can:
- Access the app from your iPhone at: https://praveenbhansali.github.io/glam-up-by-ruchika/
- Add it to your home screen for app-like experience
- All data will sync across devices automatically
