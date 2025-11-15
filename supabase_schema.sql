-- Supabase schema for kssv-ngo-website_v6_ready
-- Run this in Supabase SQL Editor to create tables and initial buckets setup

-- Enable pgcrypto for gen_random_uuid()
create extension if not exists "pgcrypto";

-- Auth is handled by Supabase Auth (no admins table required)
-- Content tables
create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  status text,
  created_at timestamp with time zone default now()
);

create table partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text,
  description text,
  logo_url text,
  website text,
  created_at timestamp with time zone default now()
);

create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  cover_image text,
  slug text unique,
  published boolean default false,
  created_at timestamp with time zone default now()
);

create table carousel_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  order_index int default 0,
  created_at timestamp with time zone default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  subject text,
  message text,
  created_at timestamp with time zone default now()
);

create table branding (
  id serial primary key,
  logo_url text,
  tagline text,
  updated_at timestamp with time zone default now()
);

-- Insert default branding row
insert into branding (logo_url, tagline) values ('/default-assets/logo.png', 'Your NGO Tagline') on conflict do nothing;

-- Optional: a very small sample carousel entries (placeholders)
insert into carousel_images (image_url, caption, order_index) values
('/default-assets/carousel1.jpg', 'Welcome to our NGO', 0),
('/default-assets/carousel2.jpg', 'Empowering communities', 1),
('/default-assets/carousel3.jpg', 'Join our projects', 2),
('/default-assets/carousel4.jpg', 'Support our mission', 3)
on conflict do nothing;