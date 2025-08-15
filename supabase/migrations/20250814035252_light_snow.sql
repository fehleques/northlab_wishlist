/*
  # Fix waitlist RLS policies for anonymous signups

  1. Security Changes
    - Drop existing restrictive policies that prevent anonymous inserts
    - Create new policy allowing anonymous users to insert waitlist entries
    - Maintain read access for authenticated users only
    - Ensure proper RLS configuration for public waitlist functionality

  2. Policy Details
    - Anonymous users can INSERT new waitlist entries
    - Authenticated users can SELECT waitlist entries
    - No UPDATE or DELETE permissions for security
*/

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Allow anonymous users to insert waitlist entries" ON waitlist;
DROP POLICY IF EXISTS "Allow authenticated users to read waitlist" ON waitlist;
DROP POLICY IF EXISTS "Users can read own data" ON waitlist;

-- Ensure RLS is enabled
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert into waitlist (for public signup)
CREATE POLICY "Enable insert for anonymous users"
  ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to read waitlist entries (for admin/management)
CREATE POLICY "Enable read for authenticated users"
  ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);

-- Grant necessary permissions to anon role
GRANT INSERT ON waitlist TO anon;
GRANT SELECT ON waitlist TO authenticated;