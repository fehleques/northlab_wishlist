/*
  # Enable anonymous waitlist signups

  1. Security Changes
    - Drop existing restrictive policies that prevent anonymous inserts
    - Create new policy allowing anonymous users to insert waitlist entries
    - Maintain read access for authenticated users only

  2. Policy Details
    - Allow INSERT operations for 'anon' role on waitlist table
    - Ensure anonymous users can only insert, not read existing data
    - Keep existing SELECT policy for authenticated users
*/

-- Drop existing policies that might be blocking anonymous inserts
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON waitlist;
DROP POLICY IF EXISTS "Users can insert waitlist entries" ON waitlist;
DROP POLICY IF EXISTS "Anonymous users can insert" ON waitlist;

-- Create policy to allow anonymous users to insert into waitlist
CREATE POLICY "Allow anonymous waitlist signup"
  ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Ensure the existing read policy for authenticated users is maintained
-- (This should already exist based on the schema, but let's make sure)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'waitlist' 
    AND policyname = 'Enable read for authenticated users'
  ) THEN
    CREATE POLICY "Enable read for authenticated users"
      ON waitlist
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;