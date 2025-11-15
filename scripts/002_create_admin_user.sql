-- Create admin user with Supabase Auth
-- This script creates an admin user for the KSSV CMS

-- First, create an admin_users table to store admin-specific information
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS on admin_users table
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admins to read their own data
CREATE POLICY "Admins can view their own data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policy to allow admins to update their own data
CREATE POLICY "Admins can update their own data"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert the admin user
-- Note: You need to create the auth user first through Supabase Dashboard or API
-- Then run this to link the admin profile

-- INSTRUCTIONS:
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Click "Add user" → "Create new user"
-- 3. Enter:
--    Email: wycliffe535@gmail.com
--    Password: papa5127
--    Auto Confirm User: YES (check this box)
-- 4. Copy the User ID from the created user
-- 5. Replace 'USER_ID_HERE' below with the actual UUID
-- 6. Run the INSERT statement below

-- INSERT INTO admin_users (user_id, full_name, role)
-- VALUES ('USER_ID_HERE', 'Wycliffe Amoke', 'admin');

-- Alternative: If you want to create the user programmatically, use this approach:
-- This requires Supabase service role key and should be run from a secure environment

COMMENT ON TABLE admin_users IS 'Stores admin user profiles and roles for the KSSV CMS';
