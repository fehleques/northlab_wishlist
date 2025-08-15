/*
  # Comprehensive RLS Policy Fix for Waitlist Table

  1. Security Configuration
    - Drop all existing policies to start fresh
    - Create explicit policy for anonymous INSERT operations
    - Maintain read access for authenticated users only
    - Ensure proper role permissions

  2. Policy Details
    - Allow anonymous users to insert waitlist entries
    - Prevent anonymous users from reading existing entries
    - Allow authenticated users to read all entries
*/

-- Drop all existing policies on waitlist table
DROP POLICY IF EXISTS "Allow anonymous waitlist signup" ON waitlist;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON waitlist;
DROP POLICY IF EXISTS "Users can insert waitlist entries" ON waitlist;
DROP POLICY IF EXISTS "Enable insert for anon users" ON waitlist;

-- Ensure RLS is enabled
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users to insert into waitlist
CREATE POLICY "anonymous_waitlist_insert" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow authenticated users to read waitlist
CREATE POLICY "authenticated_waitlist_read" ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);

-- Grant necessary permissions to anon role
GRANT INSERT ON waitlist TO anon;
GRANT USAGE ON SCHEMA public TO anon;