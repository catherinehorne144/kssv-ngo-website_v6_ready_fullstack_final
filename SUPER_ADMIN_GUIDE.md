# Super Admin Guide - KSSV CMS

## Overview

The KSSV CMS has a role-based access control system with three levels:

- **Super Admin**: Full system access including user management
- **Admin**: Full content management access
- **Editor**: Content creation and editing only

## Super Admin Privileges

As a Super Admin, you have exclusive access to:

### 1. User Management (`/admin/setup`)
- Create new admin users
- Assign roles (Admin, Editor, or Super Admin)
- Manage admin accounts

### 2. System Configuration
- Access to all CMS features
- Ability to promote/demote admin users
- Full database access

## Initial Setup

### Setting Wycliffe as Super Admin

Run the SQL script to set up the role system and make Wycliffe a super admin:

\`\`\`bash
# Execute in Supabase SQL Editor
scripts/003_add_admin_roles.sql
\`\`\`

This script will:
1. Create the `admin_users` table
2. Set up role-based policies
3. Automatically assign Wycliffe (wycliffe535@gmail.com) as Super Admin

## Adding New Admin Users

### Via Admin Panel (Recommended)

1. Login as Super Admin at `/admin/login`
2. Navigate to **Add Admin** in the sidebar (only visible to Super Admins)
3. Fill in the new admin details:
   - Full Name
   - Email
   - Password
   - Role (Admin, Editor, or Super Admin)
4. Click "Create Admin User"

### Via SQL (Manual Method)

\`\`\`sql
-- First create the user in Supabase Auth Dashboard
-- Then run this to add them to admin_users table

INSERT INTO admin_users (id, email, full_name, role, is_active)
VALUES (
  'user-uuid-from-auth',
  'newadmin@kssv.org',
  'Admin Name',
  'admin',
  TRUE
);
\`\`\`

## Role Permissions

### Super Admin
- ✅ Create/manage admin users
- ✅ Access all CMS sections
- ✅ Modify all content
- ✅ View analytics
- ✅ Manage donations
- ✅ System configuration

### Admin
- ❌ Cannot create admin users
- ✅ Access all CMS sections
- ✅ Modify all content
- ✅ View analytics
- ✅ Manage donations

### Editor
- ❌ Cannot create admin users
- ✅ Create/edit blog posts
- ✅ Manage testimonials
- ✅ Edit projects
- ❌ Limited access to sensitive data
- ❌ Cannot manage donations

## Security Best Practices

1. **Limit Super Admin Accounts**: Only create Super Admin accounts for trusted personnel
2. **Use Strong Passwords**: Enforce minimum 12 characters with mixed case, numbers, and symbols
3. **Regular Audits**: Review admin user list periodically
4. **Immediate Revocation**: Deactivate accounts immediately when staff leaves
5. **Two-Factor Authentication**: Enable 2FA in Supabase for all admin accounts

## Troubleshooting

### Cannot Access `/admin/setup`

**Problem**: Getting redirected to dashboard
**Solution**: Verify you're logged in as Super Admin:

\`\`\`sql
SELECT email, role FROM admin_users WHERE email = 'your-email@example.com';
\`\`\`

If role is not 'super_admin', update it:

\`\`\`sql
UPDATE admin_users SET role = 'super_admin' WHERE email = 'wycliffe535@gmail.com';
\`\`\`

### New Admin Cannot Login

**Problem**: User created but cannot login
**Solution**: 
1. Check if user exists in Supabase Auth Dashboard
2. Verify email is confirmed
3. Check if user exists in `admin_users` table
4. Verify `is_active` is TRUE

### Role Not Showing in Sidebar

**Problem**: "Add Admin" link not visible
**Solution**: 
1. Clear browser cache
2. Logout and login again
3. Verify role in database

## Current Super Admin

- **Name**: Wycliffe Amoke
- **Email**: wycliffe535@gmail.com
- **Role**: Super Admin
- **Access**: Full system privileges

## Support

For technical issues or questions about the Super Admin system, contact the development team or refer to the main CMS documentation.
