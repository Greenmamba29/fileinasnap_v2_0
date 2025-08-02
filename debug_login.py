#!/usr/bin/env python3
"""
Debug script to understand Supabase login issue
"""

import requests
import json
import uuid

def debug_supabase_auth():
    base_url = "https://d202cd2b-9a58-433d-8a7e-1707fca23ae6.preview.emergentagent.com"
    api_url = f"{base_url}/api"
    
    # Create a unique test user
    test_user = {
        "email": f"debuguser{uuid.uuid4().hex[:8]}@example.com",
        "password": "DebugPass123!",
        "full_name": "Debug User",
        "organization": "Debug Corp"
    }
    
    print(f"🔍 Debugging Supabase Authentication")
    print(f"📧 Test Email: {test_user['email']}")
    print("=" * 50)
    
    # Step 1: Register user
    print("1️⃣ Registering user...")
    try:
        response = requests.post(
            f"{api_url}/auth/register",
            json=test_user,
            headers={"Content-Type": "application/json"}
        )
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text}")
        
        if response.status_code != 200:
            print("❌ Registration failed, stopping debug")
            return
            
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return
    
    # Step 2: Try to login immediately
    print("\n2️⃣ Attempting immediate login...")
    try:
        login_data = {
            "email": test_user["email"],
            "password": test_user["password"]
        }
        
        response = requests.post(
            f"{api_url}/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text}")
        
        # Try to get more detailed error from response
        if response.status_code != 200:
            try:
                error_data = response.json()
                print(f"   Error Detail: {error_data.get('detail', 'No detail provided')}")
            except:
                print("   Could not parse error response as JSON")
                
    except Exception as e:
        print(f"❌ Login error: {e}")
    
    # Step 3: Test direct Supabase API call
    print("\n3️⃣ Testing direct Supabase API...")
    try:
        supabase_url = "https://dyjkhnpdyejbwsggzhoq.supabase.co"
        supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5amtobnBkeWVqYndzZ2d6aG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NDgzMTgsImV4cCI6MjA2ODAyNDMxOH0.aQsriCrlnZKA6_7w7LF-bU8koTJ2dqB_xhDmutvnzw0"
        
        headers = {
            "apikey": supabase_key,
            "Authorization": f"Bearer {supabase_key}",
            "Content-Type": "application/json"
        }
        
        login_payload = {
            "email": test_user["email"],
            "password": test_user["password"]
        }
        
        response = requests.post(
            f"{supabase_url}/auth/v1/token?grant_type=password",
            json=login_payload,
            headers=headers
        )
        
        print(f"   Direct Supabase Status: {response.status_code}")
        print(f"   Direct Supabase Response: {response.text}")
        
    except Exception as e:
        print(f"❌ Direct Supabase error: {e}")

if __name__ == "__main__":
    debug_supabase_auth()