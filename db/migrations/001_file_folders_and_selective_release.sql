-- Migration: File folders and selective release
-- Run this in your Supabase SQL editor

-- 1. Create file_folders table
CREATE TABLE IF NOT EXISTS file_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create application_files table (tracks which files assigned/released to which applicant)
CREATE TABLE IF NOT EXISTS application_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  file_id UUID REFERENCES project_files(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  released_at TIMESTAMPTZ,
  UNIQUE(application_id, file_id)
);

-- 3. Add columns to applications table
ALTER TABLE applications
  ADD COLUMN IF NOT EXISTS release_scheduled_at TIMESTAMPTZ;

-- 4. Add columns to project_files table
ALTER TABLE project_files
  ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES file_folders(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT true;

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_application_files_application_id ON application_files(application_id);
CREATE INDEX IF NOT EXISTS idx_application_files_file_id ON application_files(file_id);
CREATE INDEX IF NOT EXISTS idx_project_files_folder_id ON project_files(folder_id);
CREATE INDEX IF NOT EXISTS idx_applications_release_scheduled ON applications(release_scheduled_at)
  WHERE release_scheduled_at IS NOT NULL AND files_released = false;

-- 6. Enable RLS on new tables
ALTER TABLE file_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_files ENABLE ROW LEVEL SECURITY;

-- 7. RLS policies for file_folders (admin only via service role)
CREATE POLICY "Service role can manage file_folders" ON file_folders
  FOR ALL USING (true) WITH CHECK (true);

-- 8. RLS policies for application_files (admin only via service role)
CREATE POLICY "Service role can manage application_files" ON application_files
  FOR ALL USING (true) WITH CHECK (true);

-- Note: Existing files will have folder_id=NULL and is_default=true by default
