/*
  # EVMS Database Schema

  1. New Tables
    - `users` - Synced with Supabase Auth
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `display_name` (text)
      - `role` (enum: 'admin' or 'user')
      - `created_at` (timestamptz)
      - `last_login` (timestamptz)
    
    - `vaccination_types` - Core vaccination data
      - `id` (uuid, primary key)
      - `title` (text, unique)
      - `description` (text)
      - `created_by` (uuid, foreign key to users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Users can read all vaccination types
    - Only admins can create/update/delete vaccination types
    - Users can read their own profile

  3. Indexes
    - Index on vaccination_types.title for search
    - Index on users.email for auth
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  display_name text,
  role text DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

CREATE TABLE IF NOT EXISTS vaccination_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text UNIQUE NOT NULL,
  description text NOT NULL,
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccination_types ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Vaccination types policies
CREATE POLICY "Everyone can read vaccination types"
  ON vaccination_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert vaccination types"
  ON vaccination_types FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update vaccination types"
  ON vaccination_types FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete vaccination types"
  ON vaccination_types FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_vaccination_types_title ON vaccination_types(title);
CREATE INDEX IF NOT EXISTS idx_vaccination_types_created_by ON vaccination_types(created_by);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
