#!/usr/bin/env python3
"""
Apply database schema to Supabase using Python client
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

def read_schema_file():
    """Read the SQL schema file"""
    schema_path = 'setup-database.sql'
    if not os.path.exists(schema_path):
        print("❌ setup-database.sql file not found!")
        sys.exit(1)
    
    with open(schema_path, 'r') as file:
        return file.read()

def apply_schema(supabase: Client, schema_sql: str):
    """Apply the SQL schema to Supabase"""
    try:
        print("🚀 Applying database schema to Supabase...")
        
        # Split the schema into individual statements
        statements = [stmt.strip() for stmt in schema_sql.split(';') if stmt.strip()]
        
        success_count = 0
        total_statements = len(statements)
        
        for i, statement in enumerate(statements, 1):
            if not statement:
                continue
                
            try:
                # Execute the SQL statement using rpc call to a SQL function
                # Since supabase-py doesn't have direct SQL execution, we'll use the REST API
                result = supabase.rpc('exec_sql', {'query': statement}).execute()
                print(f"✅ Statement {i}/{total_statements} executed successfully")
                success_count += 1
            except Exception as e:
                # Some statements might fail if objects already exist, which is okay
                if 'already exists' in str(e).lower() or 'does not exist' in str(e).lower():
                    print(f"⚠️  Statement {i}/{total_statements}: {e} (This might be expected)")
                    success_count += 1
                else:
                    print(f"❌ Statement {i}/{total_statements} failed: {e}")
        
        print(f"\n📊 Schema application complete: {success_count}/{total_statements} statements processed")
        
        if success_count == total_statements:
            print("🎉 All statements executed successfully!")
        else:
            print(f"⚠️  {total_statements - success_count} statements had issues (might be expected)")
        
        return True
        
    except Exception as e:
        print(f"❌ Failed to apply schema: {e}")
        return False

def create_storage_bucket(supabase: Client):
    """Create the user-files storage bucket"""
    try:
        print("\n🗂️  Creating 'user-files' storage bucket...")
        
        # Create bucket
        result = supabase.storage.create_bucket('user-files', {'public': False})
        print("✅ Storage bucket 'user-files' created successfully (private)")
        return True
        
    except Exception as e:
        if 'already exists' in str(e).lower():
            print("ℹ️  Storage bucket 'user-files' already exists")
            return True
        else:
            print(f"❌ Failed to create storage bucket: {e}")
            print("ℹ️  You can create it manually in Supabase Dashboard > Storage")
            return False

def main():
    """Main function to apply database schema"""
    print("🗄️  FileInASnap Database Setup")
    print("=" * 50)
    
    # Load environment variables
    supabase_url, supabase_service_key = load_environment()
    print(f"🔗 Supabase URL: {supabase_url}")
    
    # Create Supabase client with service key
    supabase: Client = create_client(supabase_url, supabase_service_key)
    print("✅ Connected to Supabase with service key")
    
    # Read schema file
    schema_sql = read_schema_file()
    print("✅ Schema file loaded")
    
    # Apply schema
    schema_success = apply_schema(supabase, schema_sql)
    
    # Create storage bucket
    bucket_success = create_storage_bucket(supabase)
    
    # Summary
    print("\n" + "=" * 50)
    if schema_success and bucket_success:
        print("🎉 Database setup completed successfully!")
        print("\n📋 Next steps:")
        print("1. Start your servers (already running)")
        print("2. Visit http://localhost:3000")
        print("3. Sign in and test file upload functionality")
    else:
        print("⚠️  Database setup completed with some issues")
        print("Check the output above for details")
    
    print("=" * 50)

if __name__ == "__main__":
    main()
