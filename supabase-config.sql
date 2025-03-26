-- Enable Row Level Security
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY public_read ON questions FOR SELECT
USING (true);

-- Restrict write access to admins only
CREATE POLICY admin_write ON questions FOR ALL
TO service_role
USING (true);