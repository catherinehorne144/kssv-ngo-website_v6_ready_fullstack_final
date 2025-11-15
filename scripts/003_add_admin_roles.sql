-- Add admin roles and permissions system

-- Create admin_users table to store admin metadata and roles
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'editor')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster role lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Add trigger for updated_at
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Set Wycliffe as super admin
-- First, find the user ID for wycliffe535@gmail.com
DO $$
DECLARE
  user_id UUID;
BEGIN
  -- Get the user ID from auth.users
  SELECT id INTO user_id FROM auth.users WHERE email = 'wycliffe535@gmail.com';
  
  -- If user exists, insert or update their admin record
  IF user_id IS NOT NULL THEN
    INSERT INTO admin_users (id, email, full_name, role, is_active)
    VALUES (user_id, 'wycliffe535@gmail.com', 'Wycliffe Amoke', 'super_admin', TRUE)
    ON CONFLICT (id) 
    DO UPDATE SET role = 'super_admin', full_name = 'Wycliffe Amoke', is_active = TRUE;
    
    RAISE NOTICE 'Wycliffe Amoke has been set as super admin';
  ELSE
    RAISE NOTICE 'User wycliffe535@gmail.com not found. Please create the user first.';
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Super admins can see all admin users
CREATE POLICY "Super admins can view all admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Policy: Super admins can insert new admin users
CREATE POLICY "Super admins can create admin users"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Policy: Super admins can update admin users
CREATE POLICY "Super admins can update admin users"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Policy: Admins can view their own record
CREATE POLICY "Admins can view own record"
  ON admin_users FOR SELECT
  TO authenticated
  USING (id = auth.uid());
