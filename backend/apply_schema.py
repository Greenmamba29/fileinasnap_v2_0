#!/usr/bin/env python3
"""
Script to apply the database schema to Supabase
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

# Read the schema file
with open('schema.sql', 'r') as f:
    schema_sql = f.read()

# Split the schema into individual statements
statements = [stmt.strip() for stmt in schema_sql.split(';') if stmt.strip()]

print(f"Applying {len(statements)} SQL statements...")

# Apply each statement
for i, statement in enumerate(statements, 1):
    try:
        if statement.strip():
            print(f"Executing statement {i}/{len(statements)}: {statement[:50]}...")
            
            # Use the raw SQL execution method
            result = supabase.rpc("exec", {"sql": statement + ";"}).execute()
            print(f"✅ Statement {i} executed successfully")
            
    except Exception as e:
        print(f"❌ Error executing statement {i}: {str(e)}")
        print(f"Statement: {statement}")
        # Continue with next statement instead of stopping
        continue

print("\n🎉 Schema application completed!")
print("Next steps:")
print("1. Check your Supabase dashboard to verify tables were created")
print("2. Create the 'user-files' storage bucket")
print("3. Test your application")
