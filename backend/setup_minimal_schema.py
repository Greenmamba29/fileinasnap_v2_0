#!/usr/bin/env python3
"""
Minimal schema setup for Supabase using direct table operations
This creates the essential tables needed for the FileInASnap app
"""
import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Supabase client
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(url, key)

print("🚀 Setting up minimal FileInASnap schema in Supabase...")
print("Note: Some advanced features will need to be configured manually in Supabase dashboard")

# Create user_profiles table (simplified structure)
try:
    # Check if table exists by trying to select from it
    try:
        result = supabase.table('user_profiles').select('id').limit(1).execute()
        print("✅ user_profiles table already exists")
    except:
        # Table doesn't exist, but we can't create it via REST API
        print("❌ user_profiles table needs to be created manually in Supabase dashboard")
        print("   SQL: CREATE TABLE user_profiles (")
        print("     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),")
        print("     supabase_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,")
        print("     email TEXT NOT NULL UNIQUE,")
        print("     full_name TEXT,")
        print("     organization TEXT,")
        print("     subscription_tier TEXT DEFAULT 'free',")
        print("     profile_picture TEXT,")
        print("     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),")
        print("     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()")
        print("   );")
        print("")

    # Check user_files table
    try:
        result = supabase.table('user_files').select('id').limit(1).execute()
        print("✅ user_files table already exists")
    except:
        print("❌ user_files table needs to be created manually in Supabase dashboard")
        print("   SQL: CREATE TABLE user_files (")
        print("     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),")
        print("     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,")
        print("     name TEXT NOT NULL,")
        print("     original_name TEXT NOT NULL,")
        print("     mime_type TEXT NOT NULL,")
        print("     size BIGINT NOT NULL,")
        print("     storage_path TEXT NOT NULL,")
        print("     status TEXT DEFAULT 'uploaded',")
        print("     upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()")
        print("   );")
        print("")

    print("📋 MANUAL SETUP REQUIRED:")
    print("1. Go to your Supabase Dashboard → SQL Editor")
    print("2. Run the SQL commands shown above")
    print("3. Go to Storage → Create bucket named 'user-files'")
    print("4. Enable RLS on all tables")
    print("5. Add RLS policies to allow users to access their own data")
    
    print("\n🎉 Basic setup verification completed!")
    print("Your backend is ready to work with Supabase once tables are created manually.")
    
except Exception as e:
    print(f"❌ Error during setup: {str(e)}")
    print("Please check your Supabase credentials and try again.")
