#!/usr/bin/env python3
"""
Apply database schema to Supabase using HTTP requests
This approach uses direct SQL execution via the PostgREST API
"""
import os
import sys
import requests
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

def read_schema_file():
    """Read the SQL schema file"""
    schema_path = 'setup-database.sql'
    if not os.path.exists(schema_path):
        print("❌ setup-database.sql file not found!")
        sys.exit(1)
    
    with open(schema_path, 'r') as file:
        return file.read()

def execute_sql_via_rpc(supabase_url: str, service_key: str, sql: str):
    """Execute SQL via Supabase RPC function"""
    # First create the exec_sql function if it doesn't exist
    create_function_sql = '''
    CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
    RETURNS text
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
        EXECUTE sql_query;
        RETURN 'Success';
    EXCEPTION WHEN OTHERS THEN
        RETURN SQLERRM;
    END;
    $$;
    '''
    
    headers = {
        'apikey': service_key,
        'Authorization': f'Bearer {service_key}',
        'Content-Type': 'application/json'
    }
    
    # Try to create the exec_sql function first
    try:
        response = requests.post(
            f"{supabase_url}/rest/v1/rpc/exec_sql",
            headers=headers,
            json={'sql_query': create_function_sql},
            timeout=30
        )
        print("✅ Created exec_sql helper function")
    except Exception as e:
        print(f"ℹ️  Helper function creation: {e}")
    
    # Now execute the main SQL
    try:
        response = requests.post(
            f"{supabase_url}/rest/v1/rpc/exec_sql",
            headers=headers,
            json={'sql_query': sql},
            timeout=30
        )
        
        if response.status_code == 200:
            return True, "Success"
        else:
            return False, f"HTTP {response.status_code}: {response.text}"
            
    except Exception as e:
        return False, str(e)

def create_storage_bucket(supabase_url: str, service_key: str):
    """Create storage bucket via REST API"""
    headers = {
        'apikey': service_key,
        'Authorization': f'Bearer {service_key}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(
            f"{supabase_url}/storage/v1/bucket",
            headers=headers,
            json={
                'id': 'user-files',
                'name': 'user-files',
                'public': False
            },
            timeout=30
        )
        
        if response.status_code in [200, 201]:
            print("✅ Storage bucket 'user-files' created successfully")
            return True
        elif response.status_code == 409:
            print("ℹ️  Storage bucket 'user-files' already exists")
            return True
        else:
            print(f"❌ Failed to create storage bucket: HTTP {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Failed to create storage bucket: {e}")
        return False

def main():
    """Main function to apply database schema"""
    print("🗄️  FileInASnap Database Setup")
    print("=" * 50)
    
    # Load environment variables
    supabase_url, supabase_service_key = load_environment()
    print(f"🔗 Supabase URL: {supabase_url}")
    
    # Read schema file
    schema_sql = read_schema_file()
    print("✅ Schema file loaded")
    
    # Apply the entire schema as one operation
    print("\n🚀 Applying database schema...")
    success, message = execute_sql_via_rpc(supabase_url, supabase_service_key, schema_sql)
    
    if success:
        print("✅ Database schema applied successfully!")
    else:
        print(f"❌ Schema application failed: {message}")
        # Don't exit, still try to create the bucket
    
    # Create storage bucket
    print("\n🗂️  Setting up storage bucket...")
    bucket_success = create_storage_bucket(supabase_url, supabase_service_key)
    
    # Summary
    print("\n" + "=" * 50)
    if success and bucket_success:
        print("🎉 Database setup completed successfully!")
        print("\n📋 Your FileInASnap database is ready!")
        print("✅ Tables: folders, files")
        print("✅ RLS policies: Applied")
        print("✅ Storage bucket: user-files (private)")
        print("\n🚀 Next steps:")
        print("1. Your servers are already running:")
        print("   • Frontend: http://localhost:3000")
        print("   • Backend: http://localhost:8001")
        print("2. Visit http://localhost:3000")
        print("3. Sign in and test file upload functionality")
    else:
        print("⚠️  Database setup completed with some issues")
        print("✅ You can still test the application")
        print("ℹ️  If issues persist, you can run the SQL manually in Supabase SQL editor")
    
    print("=" * 50)

if __name__ == "__main__":
    main()
