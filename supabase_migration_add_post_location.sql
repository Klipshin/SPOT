-- Add location tracking fields to posts table
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- Add index for location-based queries
CREATE INDEX IF NOT EXISTS idx_posts_location ON posts(location);
CREATE INDEX IF NOT EXISTS idx_posts_coordinates ON posts(latitude, longitude);

-- Add comment to explain the columns
COMMENT ON COLUMN posts.location IS 'Human-readable location name/address';
COMMENT ON COLUMN posts.latitude IS 'Latitude coordinate for map pinning';
COMMENT ON COLUMN posts.longitude IS 'Longitude coordinate for map pinning';
