# 🗄️ Manual Database Setup Instructions

## ✅ What We've Completed
- ✅ **Storage Bucket**: `user-files` bucket created successfully (private)
- ✅ **Servers**: Both frontend and backend are running
- ✅ **Environment**: All configuration files are ready

## 📝 Manual Steps Required

### Step 1: Open Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project: `dyjkhnpdyejbwsggzhoq`

### Step 2: Apply Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy the entire contents from `setup-database.sql` (shown below)
4. Paste it into the SQL editor
5. Click **"Run"** to execute

### Step 3: Verify Storage Bucket
1. Go to **Storage** in your Supabase dashboard
2. Verify that the `user-files` bucket exists and is set to **Private**
3. If it doesn't exist, create it:
   - Click **"New bucket"**
   - Name: `user-files`
   - Public: **OFF** (keep it private)
   - Click **"Save"**

## 📋 SQL Schema to Copy-Paste

```sql
-- FileInASnap Enhanced Database Schema
-- This schema supports folder organization and file management with improved RLS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Folders table (enhanced from Step 5)
CREATE TABLE IF NOT EXISTS folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Files table (enhanced from Step 5)
CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id uuid REFERENCES folders(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL,
  object_key text NOT NULL,
  filename text NOT NULL,
  original_filename text,
  bytes bigint,
  mime text,
  status text DEFAULT 'uploaded',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS folders_owner_id_idx ON folders(owner_id);
CREATE INDEX IF NOT EXISTS files_owner_id_idx ON files(owner_id);
CREATE INDEX IF NOT EXISTS files_folder_id_idx ON files(folder_id);
CREATE INDEX IF NOT EXISTS files_created_at_idx ON files(created_at DESC);

-- Row Level Security (RLS) 
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "folders_owner_read" ON folders;
DROP POLICY IF EXISTS "folders_owner_write" ON folders;
DROP POLICY IF EXISTS "files_owner_read" ON files;
DROP POLICY IF EXISTS "files_owner_write" ON files;

-- Enhanced RLS policies from Step 5
CREATE POLICY "folders_owner_read" ON folders FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "folders_owner_write" ON folders FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "folders_owner_update" ON folders FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "folders_owner_delete" ON folders FOR DELETE USING (owner_id = auth.uid());

CREATE POLICY "files_owner_read" ON files FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "files_owner_write" ON files FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "files_owner_update" ON files FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "files_owner_delete" ON files FOR DELETE USING (owner_id = auth.uid());

-- Create an updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to folders and files tables
DROP TRIGGER IF EXISTS update_folders_updated_at ON folders;
DROP TRIGGER IF EXISTS update_files_updated_at ON files;

CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON folders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🎉 After Setup is Complete

Once you've run the SQL in Supabase Dashboard, your FileInASnap application will be fully ready!

### Test Your Application:
1. **Visit**: http://localhost:3000
2. **Sign In** with your Supabase account
3. **Test Upload**: Navigate to Dashboard and try the drag & drop upload
4. **Verify**: Check that files appear in your dashboard

### Your App URLs:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8001  
- **API Docs**: http://localhost:8001/docs

## 🔧 Troubleshooting

If you encounter any issues:
1. Check that both servers are running
2. Verify your Supabase credentials in the `.env` files
3. Ensure you're signed in to the same Supabase project
4. Check browser console for any errors

---

**Ready to test your FileInASnap application!** 🚀
