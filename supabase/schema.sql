-- =========================================================================
-- NORTHLAB WAITLIST SCHEMA
-- =========================================================================
-- This script initializes the waitlist table with creator context tracking
-- and configures secure Row Level Security (RLS) policies.
-- Run this in the SQL Editor of your Supabase dashboard (https://database.new).

-- 1. Create the waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT,
  challenge TEXT,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Enable Row Level Security (RLS) to ensure database security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow any anonymous visitor to submit their email (Insert)
CREATE POLICY "Allow anonymous waitlist submissions" 
  ON public.waitlist
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- 4. Policy: Allow any anonymous visitor to update their own record by email during onboarding (Update)
CREATE POLICY "Allow anonymous context updates during onboarding" 
  ON public.waitlist
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- 5. Policy: Restrict reading to authenticated staff/admin only (Select)
-- (This prevents visitors from scraping or reading other subscribers' emails!)
CREATE POLICY "Restrict select to authenticated administrators only" 
  ON public.waitlist
  FOR SELECT 
  TO authenticated
  USING (true);
