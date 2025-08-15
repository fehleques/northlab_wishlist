/*
  # Fix waitlist RLS policy for anonymous signups

  1. Security Changes
    - Add policy to allow anonymous users to insert into waitlist table
    - This enables website visitors to sign up for the waitlist without authentication
    - Maintains existing authenticated user read permissions

  2. Policy Details
    - Allows INSERT operations for anonymous (anon) role
    - Restricts to only INSERT operations (no read/update/delete for anon users)
    - Authenticated users retain their existing read permissions
*/

-- Drop the existing restrictive insert policy if it exists
DROP POLICY IF EXISTS "Allow public insert for waitlist signups" ON waitlist;

-- Create a new policy that allows anonymous users to insert into waitlist
CREATE POLICY "Allow anonymous users to insert waitlist entries"
  ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Ensure the existing read policy for authenticated users remains
-- (This should already exist, but we'll recreate it to be safe)
DROP POLICY IF EXISTS "Allow authenticated users to read waitlist" ON waitlist;

CREATE POLICY "Allow authenticated users to read waitlist"
  ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);