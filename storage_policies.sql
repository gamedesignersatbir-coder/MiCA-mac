-- POLICY 1: Allow authenticated users to upload to 'campaign-assets'
-- This fixes the "new row violates row-level security policy" error during image generation
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'campaign-assets' );

-- POLICY 2: Allow public read access to 'campaign-assets'
-- This ensures the generated images are visible in the dashboard
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING ( bucket_id = 'campaign-assets' );

-- POLICY 3: Allow users to update/delete their own files (Optional but good practice)
CREATE POLICY "Allow individual update own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING ( auth.uid() = owner )
WITH CHECK ( bucket_id = 'campaign-assets' );
