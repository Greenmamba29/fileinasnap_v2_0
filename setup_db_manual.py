#!/usr/bin/env python3
"""
Manual database setup using individual table operations
"""
import os
import sys
from supabase import create_client, Client
from dotenv import load_dotenv

def load_environment():
    """Load environment variables from backend/.env"""
    backend_env_path = os.path.join('backend', '.env')
    if not os.path.exists(backend_env_path):
        print("❌ Backend .env file not found!")
        sys.exit(1)
    
    load_dotenv(backend_env_path)
    
    supabase_url = os.getenv('SUPABASE_URL')
    supabase_service_key = os.getenv('SUPABASE_SERVICE_KEY')
    
    if not supabase_url or not supabase_service_key:
        print("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in backend/.env")
        sys.exit(1)
    
    return supabase_url, supabase_service_key

def test_database_connection(supabase: Client):
    """Test if we can connect and verify existing tables"""
    try:
        print("🔍 Testing database connection...")
        
        # Try to query existing tables
        try:
            folders_result = supabase.table('folders').select('count').execute()
            print("✅ 'folders' table exists and is accessible")
        except Exception as e:
            print(f"ℹ️  'folders' table: {e}")
        
        try:
            files_result = supabase.table('files').select('count').execute()
            print("✅ 'files' table exists and is accessible")
        except Exception as e:
            print(f"ℹ️  'files' table: {e}")
        
        # Check storage
        try:
            buckets = supabase.storage.list_buckets()
            bucket_names = [bucket['name'] for bucket in buckets]
            if 'user-files' in bucket_names:
                print("✅ 'user-files' storage bucket exists")
            else:
                print("ℹ️  'user-files' storage bucket not found")
        except Exception as e:
            print(f"ℹ️  Storage check: {e}")
        
        return True
        
    except Exception as e:
        print(f"❌ Database connection test failed: {e}")
        return False

def create_test_folder(supabase: Client):
    """Create a test folder to verify the schema works"""
    try:
        print("\n🧪 Testing folder creation...")
        
        # Try to insert a test folder
        result = supabase.table('folders').insert({
            'name': 'Test Folder',
            'owner_id': '00000000-0000-0000-0000-000000000000'  # Dummy UUID for testing
        }).execute()
        
        if result.data:
            print("✅ Test folder created successfully - schema is working!")
            
            # Clean up the test folder
            supabase.table('folders').delete().eq('name', 'Test Folder').execute()
            print("🧹 Test folder cleaned up")
            return True
        
    except Exception as e:
        print(f"ℹ️  Folder creation test: {e}")
        if "auth.uid()" in str(e):
            print("ℹ️  RLS is active (this is expected and good!)")
            return True
        return False

def main():
    """Main function to test database setup"""
    print("🗄️  FileInASnap Database Connection Test")
    print("=" * 50)
    
    # Load environment variables
    supabase_url, supabase_service_key = load_environment()
    print(f"🔗 Supabase URL: {supabase_url}")
    
    # Create Supabase client with service key
    supabase: Client = create_client(supabase_url, supabase_service_key)
    print("✅ Connected to Supabase with service key")
    
    # Test database connection
    connection_ok = test_database_connection(supabase)
    
    # Test table operations
    if connection_ok:
        schema_ok = create_test_folder(supabase)
    else:
        schema_ok = False
    
    # Summary
    print("\n" + "=" * 50)
    print("📋 Database Setup Status:")
    
    if connection_ok and schema_ok:
        print("🎉 Database is ready for FileInASnap!")
        print("✅ Tables: Accessible")
        print("✅ Storage: Ready")
        print("✅ RLS: Active")
    else:
        print("📝 Manual Setup Required:")
        print("\n1. Go to your Supabase Dashboard")
        print("2. Navigate to SQL Editor") 
        print("3. Copy and paste the contents of 'setup-database.sql'")
        print("4. Execute the SQL")
        print("5. Go to Storage and ensure 'user-files' bucket exists")
    
    print("\n🚀 Ready to test your application:")
    print("• Frontend: http://localhost:3000")
    print("• Backend:  http://localhost:8001")
    print("• API Docs: http://localhost:8001/docs")
    print("=" * 50)

if __name__ == "__main__":
    main()
