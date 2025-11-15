# KSSV Admin CMS Documentation

## Overview

The KSSV Admin CMS is a comprehensive content management system built with Next.js, Supabase, and TypeScript. It provides a secure, user-friendly interface for managing all aspects of the KSSV NGO website.

## Features

### Authentication
- Secure login with Supabase authentication
- Protected admin routes with middleware
- Session management and automatic token refresh

### Dashboard
- Real-time statistics from all database tables
- Quick action cards for common tasks
- Recent activity feed
- Overview of pending items

### Forms Management
1. **Volunteers** (`/admin/volunteers`)
   - View all volunteer applications
   - Approve/reject applications
   - View detailed application information
   - Search and filter volunteers

2. **Members** (`/admin/members`)
   - Manage membership applications
   - Activate/deactivate members
   - View member details and skills
   - Track membership status

3. **Partners** (`/admin/partners`)
   - Review partnership inquiries
   - Manage partnership status
   - View organization details
   - Track partnership types

4. **Contact Messages** (`/admin/messages`)
   - View all contact form submissions
   - Mark messages as read/responded
   - Search messages by content
   - Delete spam or irrelevant messages

### Content Management
1. **Testimonials** (`/admin/testimonials`)
   - Review submitted testimonials
   - Approve/reject testimonials
   - Feature testimonials on homepage
   - Manage testimonial visibility

2. **Blog Posts** (`/admin/blog`)
   - Create new blog posts
   - Edit existing posts
   - Publish/unpublish posts
   - Manage categories and authors
   - Add featured images

3. **Projects** (`/admin/projects`)
   - Create and manage projects
   - Track project progress
   - Update beneficiary counts
   - Manage project budgets
   - Set project timelines

4. **Donations** (`/admin/donations`)
   - View all donation records
   - Track donation status
   - View transaction details
   - Monitor total donations
   - Export donation data

### Analytics Dashboard (`/admin/analytics`)
- Community engagement metrics
- Application status charts
- Content publishing statistics
- Message response tracking
- Donation summaries
- Visual charts and graphs

## Database Schema

### Tables
- `volunteers` - Volunteer applications
- `members` - Membership records
- `partners` - Partnership inquiries
- `contact_messages` - Contact form submissions
- `testimonials` - User testimonials
- `blog_posts` - Blog articles
- `projects` - Organization projects
- `donations` - Donation records

All tables include:
- Automatic timestamps (`created_at`, `updated_at`)
- UUID primary keys
- Status fields for workflow management
- Proper indexes for performance

## Setup Instructions

### 1. Database Setup
Run the SQL script to create all necessary tables:
\`\`\`bash
# Execute the script in Supabase SQL Editor or via CLI
psql -h your-db-host -U your-user -d your-db -f scripts/001_create_cms_tables.sql
\`\`\`

### 2. Create Admin User
In Supabase Dashboard:
1. Go to Authentication > Users
2. Click "Add User"
3. Enter admin email and password
4. Confirm the user

### 3. Environment Variables
Ensure these are set (already configured in v0):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for admin operations)

### 4. Access the CMS
1. Navigate to `/admin/login`
2. Enter admin credentials
3. You'll be redirected to the dashboard

## Usage Guide

### Managing Applications
1. Navigate to the relevant section (Volunteers, Members, Partners)
2. Use the search bar to find specific applications
3. Click the eye icon to view details
4. Use the checkmark to approve or X to reject
5. Use the trash icon to delete

### Creating Content
1. Go to Blog or Projects section
2. Click "New Blog Post" or "New Project"
3. Fill in all required fields
4. Toggle publish status
5. Click "Create" to save

### Reviewing Testimonials
1. Go to Testimonials section
2. Click on a testimonial to view details
3. Approve or reject the testimonial
4. Toggle "Featured" to show on homepage

### Monitoring Analytics
1. Visit the Analytics dashboard
2. View real-time statistics
3. Analyze charts for trends
4. Check pending actions
5. Monitor donation performance

## Security Best Practices

1. **Strong Passwords**: Use complex passwords for admin accounts
2. **Regular Backups**: Backup Supabase database regularly
3. **Access Control**: Limit admin access to trusted personnel
4. **Audit Logs**: Monitor admin actions through Supabase logs
5. **HTTPS Only**: Always access admin panel over HTTPS

## Troubleshooting

### Can't Login
- Verify user exists in Supabase Authentication
- Check environment variables are set
- Clear browser cache and cookies
- Check Supabase service status

### Data Not Loading
- Check Supabase connection
- Verify table names match schema
- Check browser console for errors
- Ensure RLS policies allow access

### Charts Not Displaying
- Verify Recharts is installed
- Check data is being fetched
- Inspect browser console for errors

## Support

For technical support or questions:
- Email: admin@kssv.org
- Check Supabase logs for errors
- Review browser console for client-side issues

## Future Enhancements

Planned features:
- Email notifications for new submissions
- Bulk actions for managing multiple items
- Export data to CSV/Excel
- Advanced filtering and sorting
- User role management
- Activity audit logs
- Automated reports
