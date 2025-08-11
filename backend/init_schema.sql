-- FileInASnap Database Schema
-- This schema supports folder organization and file management

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Folders table
CREATE TABLE IF NOT EXISTS folders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW()
);

-- Files table
CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  folder_id uuid NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  object_key text NOT NULL, -- Path in Supabase storage
  filename text NOT NULL,
  original_filename text NOT NULL,
  bytes bigint NOT NULL DEFAULT 0,
  mime text,
  status text DEFAULT 'uploaded',
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS folders_owner_id_idx ON folders(owner_id);
CREATE INDEX IF NOT EXISTS files_owner_id_idx ON files(owner_id);
CREATE INDEX IF NOT EXISTS files_folder_id_idx ON files(folder_id);
CREATE INDEX IF NOT EXISTS files_created_at_idx ON files(created_at DESC);

-- Row Level Security (RLS) policies
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Folders policies
CREATE POLICY "Users can view their own folders" ON folders
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can create folders" ON folders
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own folders" ON folders
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own folders" ON folders
  FOR DELETE USING (auth.uid() = owner_id);

-- Files policies
CREATE POLICY "Users can view their own files" ON files
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can create files" ON files
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own files" ON files
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own files" ON files
  FOR DELETE USING (auth.uid() = owner_id);

-- Storage bucket for user files (if not exists)
-- Note: This needs to be created through Supabase dashboard or CLI
-- CREATE BUCKET IF NOT EXISTS 'user-files' WITH (public = false);

-- Storage policies for user-files bucket
-- Users can upload files to their own folder
-- CREATE POLICY "Users can upload files" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'user-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can view their own files
-- CREATE POLICY "Users can view own files" ON storage.objects
--   FOR SELECT USING (bucket_id = 'user-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own files
-- CREATE POLICY "Users can delete own files" ON storage.objects
--   FOR DELETE USING (bucket_id = 'user-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create an updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to folders and files tables
CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON folders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
