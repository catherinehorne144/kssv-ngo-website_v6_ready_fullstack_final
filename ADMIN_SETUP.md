# Admin User Setup Guide

This guide explains how to create the initial admin user for the KSSV CMS.

## Method 1: Using the Setup Page (Recommended)

1. Navigate to `/admin/setup` in your browser
2. The form will be pre-filled with the admin credentials
3. Click "Create Admin User"
4. If successful, you can now login at `/admin/login`

## Method 2: Manual Setup via Supabase Dashboard

1. **Create the Auth User:**
   - Go to your Supabase Dashboard
   - Navigate to Authentication → Users
   - Click "Add user" → "Create new user"
   - Enter the following details:
     - Email: `wycliffe535@gmail.com`
     - Password: `papa5127`
     - Check "Auto Confirm User" ✓
   - Click "Create user"
   - Copy the User ID (UUID) that appears

2. **Run the SQL Script:**
   - Go to SQL Editor in Supabase Dashboard
   - Open `scripts/002_create_admin_user.sql`
   - Replace `'USER_ID_HERE'` with the actual User ID you copied
   - Uncomment the INSERT statement
   - Run the script

3. **Login:**
   - Navigate to `/admin/login`
   - Enter:
     - Email: `wycliffe535@gmail.com`
     - Password: `papa5127`
   - Click "Sign In"

## Admin Credentials

**Name:** Wycliffe Amoke  
**Email:** wycliffe535@gmail.com  
**Password:** papa5127  
**Role:** Admin

## Troubleshooting

### "User already exists" error
- The user may have been created already
- Try logging in directly at `/admin/login`
- If login fails, reset the password in Supabase Dashboard

### "Profile setup failed" message
- The auth user was created but the admin profile wasn't
- Run the SQL script manually (Method 2, step 2)
- Use the User ID from the error message

### Cannot access admin pages after login
- Ensure the `admin_users` table exists
- Run `scripts/001_create_cms_tables.sql` if not
- Check that your user_id is in the `admin_users` table

## Security Notes

- Change the default password immediately after first login
- Store credentials securely
- Never commit credentials to version control
- Use environment variables for sensitive data
- The setup page (`/admin/setup`) should be removed or protected in production
</parameter>
