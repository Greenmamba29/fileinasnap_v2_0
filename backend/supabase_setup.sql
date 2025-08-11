-- FileInASnap Complete Setup Script for Supabase
-- Copy and paste this entire script into your Supabase Dashboard > SQL Editor

-- 1. Create the user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supabase_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    organization TEXT,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'team', 'enterprise')),
    profile_picture TEXT,
    storage_used_bytes BIGINT DEFAULT 0,
    file_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create the user_files table
CREATE TABLE IF NOT EXISTS user_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size BIGINT NOT NULL CHECK (size > 0),
    storage_path TEXT NOT NULL,
    status TEXT DEFAULT 'uploaded' CHECK (status IN ('uploading', 'uploaded', 'processing', 'ready', 'error', 'deleted')),
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'
);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_supabase_user_id ON user_profiles(supabase_user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_files_user_id ON user_files(user_id);
CREATE INDEX IF NOT EXISTS idx_user_files_upload_date ON user_files(upload_date DESC);
CREATE INDEX IF NOT EXISTS idx_user_files_status ON user_files(status);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_files ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = supabase_user_id);

CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = supabase_user_id);

CREATE POLICY "Users can insert own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = supabase_user_id);

-- 6. Create RLS Policies for user_files
CREATE POLICY "Users can view own files"
    ON user_files FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own files"
    ON user_files FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own files"
    ON user_files FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own files"
    ON user_files FOR DELETE
    USING (auth.uid() = user_id);

-- 7. Create function to automatically create user profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.user_profiles (supabase_user_id, email, full_name, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Create function to update user storage statistics
CREATE OR REPLACE FUNCTION update_user_storage_stats()
RETURNS trigger AS $$
BEGIN
    UPDATE user_profiles 
    SET 
        storage_used_bytes = (
            SELECT COALESCE(SUM(size), 0) 
            FROM user_files 
            WHERE user_id = COALESCE(NEW.user_id, OLD.user_id) 
            AND status NOT IN ('deleted', 'error')
        ),
        file_count = (
            SELECT COUNT(*) 
            FROM user_files 
            WHERE user_id = COALESCE(NEW.user_id, OLD.user_id) 
            AND status NOT IN ('deleted', 'error')
        ),
        updated_at = NOW()
    WHERE supabase_user_id = COALESCE(NEW.user_id, OLD.user_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create triggers to update storage stats
DROP TRIGGER IF EXISTS update_storage_stats_on_file_change ON user_files;
CREATE TRIGGER update_storage_stats_on_file_change
    AFTER INSERT OR UPDATE OR DELETE ON user_files
    FOR EACH ROW EXECUTE FUNCTION update_user_storage_stats();

-- 11. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- 12. Create storage bucket (this needs to be done in Storage UI)
-- Go to Storage > Create Bucket > Name: "user-files" > Public: false

-- ✅ Setup complete! Your database is ready for FileInASnap.
