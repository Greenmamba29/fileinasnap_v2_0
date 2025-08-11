-- FileInASnap Database Schema for Supabase
-- This script creates the necessary tables and Row Level Security (RLS) policies

-- Create custom types
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'team', 'enterprise');
CREATE TYPE file_status AS ENUM ('uploading', 'uploaded', 'processing', 'ready', 'error', 'deleted');

-- User Profiles Table
-- Extends Supabase auth.users with additional application data
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    organization TEXT,
    subscription_tier subscription_tier DEFAULT 'free',
    profile_picture TEXT,
    storage_used_bytes BIGINT DEFAULT 0,
    file_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id),
    UNIQUE(email)
);

-- User Files Table
-- Stores metadata for user uploaded files
CREATE TABLE IF NOT EXISTS user_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size BIGINT NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT,
    thumbnail_url TEXT,
    ai_tags TEXT[], -- AI-generated tags
    ai_description TEXT, -- AI-generated description
    ai_processed BOOLEAN DEFAULT FALSE,
    ai_processing_error TEXT,
    status file_status DEFAULT 'uploaded',
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_accessed TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    CONSTRAINT valid_file_size CHECK (size > 0),
    CONSTRAINT valid_mime_type CHECK (mime_type ~ '^[a-zA-Z]+/[a-zA-Z0-9][a-zA-Z0-9!#$&\-\^_.]*$')
);

-- File Shares Table
-- For sharing files with other users or publicly
CREATE TABLE IF NOT EXISTS file_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID REFERENCES user_files(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    shared_with_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    share_token TEXT UNIQUE, -- For public sharing
    expires_at TIMESTAMP WITH TIME ZONE,
    permission_type TEXT DEFAULT 'read' CHECK (permission_type IN ('read', 'write')),
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    accessed_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE
);

-- User Sessions Table (Optional - for enhanced session management)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Activity Logs Table
-- Track user actions for analytics and debugging
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_files_user_id ON user_files(user_id);
CREATE INDEX IF NOT EXISTS idx_user_files_upload_date ON user_files(upload_date DESC);
CREATE INDEX IF NOT EXISTS idx_user_files_status ON user_files(status);
CREATE INDEX IF NOT EXISTS idx_user_files_mime_type ON user_files(mime_type);
CREATE INDEX IF NOT EXISTS idx_user_files_ai_tags ON user_files USING gin(ai_tags);
CREATE INDEX IF NOT EXISTS idx_file_shares_file_id ON file_shares(file_id);
CREATE INDEX IF NOT EXISTS idx_file_shares_owner_id ON file_shares(owner_id);
CREATE INDEX IF NOT EXISTS idx_file_shares_shared_with_user_id ON file_shares(shared_with_user_id);
CREATE INDEX IF NOT EXISTS idx_file_shares_share_token ON file_shares(share_token);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
    ON user_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_files
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

-- RLS Policies for file_shares
CREATE POLICY "Users can view shares they own"
    ON file_shares FOR SELECT
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can view shares directed to them"
    ON file_shares FOR SELECT
    USING (auth.uid() = shared_with_user_id);

CREATE POLICY "Users can create shares for their files"
    ON file_shares FOR INSERT
    WITH CHECK (
        auth.uid() = owner_id AND
        EXISTS (SELECT 1 FROM user_files WHERE id = file_id AND user_id = auth.uid())
    );

CREATE POLICY "Users can update their own shares"
    ON file_shares FOR UPDATE
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own shares"
    ON file_shares FOR DELETE
    USING (auth.uid() = owner_id);

-- RLS Policies for user_sessions
CREATE POLICY "Users can view own sessions"
    ON user_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
    ON user_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
    ON user_sessions FOR UPDATE
    USING (auth.uid() = user_id);

-- RLS Policies for activity_logs
CREATE POLICY "Users can view own activity logs"
    ON activity_logs FOR SELECT
    USING (auth.uid() = user_id);

-- Functions and Triggers

-- Function to automatically create user profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, email, full_name, created_at, updated_at)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
        now(),
        now()
    );
    RETURN new;
END;
$$ language plpgsql security definer;

-- Trigger to create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update user storage statistics
CREATE OR REPLACE FUNCTION update_user_storage_stats()
RETURNS trigger AS $$
BEGIN
    -- Update storage used and file count for the user
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
        updated_at = now()
    WHERE user_id = COALESCE(NEW.user_id, OLD.user_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language plpgsql security definer;

-- Triggers to update storage stats
DROP TRIGGER IF EXISTS update_storage_stats_on_file_change ON user_files;
CREATE TRIGGER update_storage_stats_on_file_change
    AFTER INSERT OR UPDATE OR DELETE ON user_files
    FOR EACH ROW EXECUTE PROCEDURE update_user_storage_stats();

-- Function to log user activities
CREATE OR REPLACE FUNCTION log_user_activity(
    user_id_param UUID,
    action_param TEXT,
    resource_type_param TEXT DEFAULT NULL,
    resource_id_param UUID DEFAULT NULL,
    details_param JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO activity_logs (user_id, action, resource_type, resource_id, details)
    VALUES (user_id_param, action_param, resource_type_param, resource_id_param, details_param)
    RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ language plpgsql security definer;

-- Create storage bucket for user files (run this in Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES (
--     'user-files',
--     'user-files',
--     false,
--     52428800, -- 50MB limit
--     ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'video/mp4', 'video/quicktime', 'video/x-msvideo']
-- );

-- Storage RLS policies (run these in Supabase dashboard)
-- CREATE POLICY "Users can upload their own files"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'user-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can view their own files"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'user-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can update their own files"
-- ON storage.objects FOR UPDATE
-- USING (bucket_id = 'user-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can delete their own files"
-- ON storage.objects FOR DELETE
-- USING (bucket_id = 'user-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create a view for user analytics (Pro+ users)
CREATE OR REPLACE VIEW user_analytics AS
SELECT 
    up.user_id,
    up.email,
    up.full_name,
    up.subscription_tier,
    up.storage_used_bytes,
    up.file_count,
    up.created_at as user_created_at,
    COUNT(DISTINCT uf.mime_type) as unique_file_types,
    COUNT(DISTINCT DATE(uf.upload_date)) as active_upload_days,
    AVG(uf.size) as avg_file_size,
    MAX(uf.upload_date) as last_upload_date
FROM user_profiles up
LEFT JOIN user_files uf ON up.user_id = uf.user_id AND uf.status NOT IN ('deleted', 'error')
GROUP BY up.user_id, up.email, up.full_name, up.subscription_tier, up.storage_used_bytes, up.file_count, up.created_at;

-- Grant access to the analytics view
GRANT SELECT ON user_analytics TO authenticated;
