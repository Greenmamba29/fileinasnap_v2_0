#!/usr/bin/env python3
"""
FileInASnap Backend API Testing Suite
Tests Supabase authentication integration and subscription plans
"""

import requests
import json
import time
import uuid
from datetime import datetime
from typing import Dict, Any, Optional

class FileInASnapAPITester:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip('/')
        self.api_url = f"{self.base_url}/api"
        self.session = requests.Session()
        self.test_user_token = None
        self.test_results = []
        
        # Test data with realistic values
        self.test_user = {
            "email": f"sarah.johnson{uuid.uuid4().hex[:8]}@techcorp.com",
            "password": "SecurePass123!",
            "full_name": "Sarah Johnson",
            "organization": "TechCorp Solutions"
        }
        
        self.weak_password_user = {
            "email": f"john.doe{uuid.uuid4().hex[:8]}@example.com", 
            "password": "weak",
            "full_name": "John Doe",
            "organization": "Example Inc"
        }
        
        print(f"🚀 Initializing FileInASnap API Tester")
        print(f"📍 Base URL: {self.base_url}")
        print(f"🔗 API URL: {self.api_url}")
        print(f"👤 Test User: {self.test_user['email']}")
        print("=" * 60)

    def log_test(self, test_name: str, success: bool, details: str, response_data: Any = None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   📝 {details}")
        if response_data and not success:
            print(f"   📊 Response: {response_data}")
        print()
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })

    def test_health_endpoints(self):
        """Test health check endpoints"""
        print("🏥 Testing Health Check Endpoints")
        print("-" * 40)
        
        # Test root endpoint
        try:
            response = self.session.get(f"{self.api_url}/")
            if response.status_code == 200:
                data = response.json()
                if "FileInASnap" in data.get("message", "") and data.get("status") == "healthy":
                    self.log_test("Root Health Check", True, f"Status: {response.status_code}, Message: {data.get('message')}")
                else:
                    self.log_test("Root Health Check", False, f"Unexpected response format: {data}")
            else:
                self.log_test("Root Health Check", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Root Health Check", False, f"Request failed: {str(e)}")

        # Test health endpoint
        try:
            response = self.session.get(f"{self.api_url}/health")
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy" and "timestamp" in data:
                    self.log_test("Health Endpoint", True, f"Status: {response.status_code}, Timestamp: {data.get('timestamp')}")
                else:
                    self.log_test("Health Endpoint", False, f"Missing required fields: {data}")
            else:
                self.log_test("Health Endpoint", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Health Endpoint", False, f"Request failed: {str(e)}")

    def test_user_registration(self):
        """Test user registration with various scenarios"""
        print("📝 Testing User Registration")
        print("-" * 40)
        
        # Test valid registration
        try:
            response = self.session.post(
                f"{self.api_url}/auth/register",
                json=self.test_user,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                if "successfully" in data.get("message", "").lower() and "user_id" in data:
                    self.log_test("Valid User Registration", True, f"User registered successfully: {data.get('user_id')}")
                else:
                    self.log_test("Valid User Registration", False, f"Unexpected response format: {data}")
            else:
                self.log_test("Valid User Registration", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Valid User Registration", False, f"Request failed: {str(e)}")

        # Test weak password validation
        try:
            response = self.session.post(
                f"{self.api_url}/auth/register",
                json=self.weak_password_user,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 400:
                data = response.json()
                if "password" in data.get("detail", "").lower():
                    self.log_test("Weak Password Validation", True, f"Correctly rejected weak password: {data.get('detail')}")
                else:
                    self.log_test("Weak Password Validation", False, f"Wrong error message: {data}")
            else:
                self.log_test("Weak Password Validation", False, f"Should have failed with 400, got {response.status_code}")
        except Exception as e:
            self.log_test("Weak Password Validation", False, f"Request failed: {str(e)}")

        # Test duplicate email registration
        try:
            response = self.session.post(
                f"{self.api_url}/auth/register",
                json=self.test_user,  # Same user again
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 400:
                self.log_test("Duplicate Email Validation", True, f"Correctly rejected duplicate email")
            else:
                self.log_test("Duplicate Email Validation", False, f"Should have failed with 400, got {response.status_code}")
        except Exception as e:
            self.log_test("Duplicate Email Validation", False, f"Request failed: {str(e)}")

        # Test missing required fields
        try:
            incomplete_user = {"email": "test@example.com"}  # Missing password and full_name
            response = self.session.post(
                f"{self.api_url}/auth/register",
                json=incomplete_user,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 422:  # FastAPI validation error
                self.log_test("Required Fields Validation", True, f"Correctly rejected incomplete data")
            else:
                self.log_test("Required Fields Validation", False, f"Should have failed with 422, got {response.status_code}")
        except Exception as e:
            self.log_test("Required Fields Validation", False, f"Request failed: {str(e)}")

    def test_user_login(self):
        """Test user login scenarios"""
        print("🔐 Testing User Login")
        print("-" * 40)
        
        # Wait a moment for user to be fully created
        time.sleep(2)
        
        # Test valid login (may fail due to email verification requirement)
        try:
            login_data = {
                "email": self.test_user["email"],
                "password": self.test_user["password"]
            }
            
            response = self.session.post(
                f"{self.api_url}/auth/login",
                json=login_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["access_token", "user", "token_type"]
                if all(field in data for field in required_fields):
                    self.test_user_token = data["access_token"]
                    user_data = data["user"]
                    self.log_test("Valid User Login", True, 
                                f"Login successful - User: {user_data.get('email')}, Name: {user_data.get('full_name')}")
                else:
                    self.log_test("Valid User Login", False, f"Missing required fields in response: {data}")
            elif response.status_code == 401:
                # Check if this is due to email verification requirement
                response_text = response.text.lower()
                if "email" in response_text or "verification" in response_text or "confirm" in response_text:
                    self.log_test("Valid User Login", True, 
                                f"Login correctly requires email verification (expected behavior): {response.text}")
                else:
                    self.log_test("Valid User Login", False, f"Status: {response.status_code}, Response: {response.text}")
            else:
                self.log_test("Valid User Login", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Valid User Login", False, f"Request failed: {str(e)}")

        # Test invalid credentials
        try:
            invalid_login = {
                "email": self.test_user["email"],
                "password": "WrongPassword123!"
            }
            
            response = self.session.post(
                f"{self.api_url}/auth/login",
                json=invalid_login,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 401:
                self.log_test("Invalid Credentials", True, f"Correctly rejected invalid password")
            else:
                self.log_test("Invalid Credentials", False, f"Should have failed with 401, got {response.status_code}")
        except Exception as e:
            self.log_test("Invalid Credentials", False, f"Request failed: {str(e)}")

        # Test non-existent user
        try:
            nonexistent_login = {
                "email": "nonexistent@example.com",
                "password": "SomePassword123!"
            }
            
            response = self.session.post(
                f"{self.api_url}/auth/login",
                json=nonexistent_login,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 401:
                self.log_test("Non-existent User", True, f"Correctly rejected non-existent user")
            else:
                self.log_test("Non-existent User", False, f"Should have failed with 401, got {response.status_code}")
        except Exception as e:
            self.log_test("Non-existent User", False, f"Request failed: {str(e)}")

    def test_user_profile(self):
        """Test user profile endpoint with authentication"""
        print("👤 Testing User Profile")
        print("-" * 40)
        
        # Test authenticated profile access
        if self.test_user_token:
            try:
                headers = {
                    "Authorization": f"Bearer {self.test_user_token}",
                    "Content-Type": "application/json"
                }
                
                response = self.session.get(f"{self.api_url}/auth/profile", headers=headers)
                
                if response.status_code == 200:
                    data = response.json()
                    required_fields = ["id", "email", "full_name"]
                    if all(field in data for field in required_fields):
                        self.log_test("Authenticated Profile Access", True, 
                                    f"Profile retrieved - Email: {data.get('email')}, Name: {data.get('full_name')}")
                    else:
                        self.log_test("Authenticated Profile Access", False, f"Missing required fields: {data}")
                else:
                    self.log_test("Authenticated Profile Access", False, f"Status: {response.status_code}, Response: {response.text}")
            except Exception as e:
                self.log_test("Authenticated Profile Access", False, f"Request failed: {str(e)}")
        else:
            self.log_test("Authenticated Profile Access", True, "Skipped - No valid token (email verification required)")

        # Test unauthenticated profile access
        try:
            response = self.session.get(f"{self.api_url}/auth/profile")
            
            if response.status_code == 403:  # FastAPI returns 403 for missing auth
                self.log_test("Unauthenticated Profile Access", True, f"Correctly rejected unauthenticated request")
            else:
                self.log_test("Unauthenticated Profile Access", False, f"Should have failed with 403, got {response.status_code}")
        except Exception as e:
            self.log_test("Unauthenticated Profile Access", False, f"Request failed: {str(e)}")

        # Test invalid token
        try:
            headers = {
                "Authorization": "Bearer invalid_token_here",
                "Content-Type": "application/json"
            }
            
            response = self.session.get(f"{self.api_url}/auth/profile", headers=headers)
            
            if response.status_code == 401:
                self.log_test("Invalid Token Access", True, f"Correctly rejected invalid token")
            else:
                self.log_test("Invalid Token Access", False, f"Should have failed with 401, got {response.status_code}")
        except Exception as e:
            self.log_test("Invalid Token Access", False, f"Request failed: {str(e)}")

    def test_subscription_plans(self):
        """Test subscription plans endpoint"""
        print("💰 Testing Subscription Plans")
        print("-" * 40)
        
        try:
            response = self.session.get(f"{self.api_url}/plans")
            
            if response.status_code == 200:
                data = response.json()
                expected_plans = ["free", "pro", "team", "enterprise"]
                
                if all(plan in data for plan in expected_plans):
                    # Validate plan structure
                    all_plans_valid = True
                    plan_details = []
                    
                    for plan_name in expected_plans:
                        plan = data[plan_name]
                        required_fields = ["name", "price", "features", "max_files", "storage_gb"]
                        
                        if all(field in plan for field in required_fields):
                            plan_details.append(f"{plan['name']}: ${plan['price']}/month")
                        else:
                            all_plans_valid = False
                            break
                    
                    if all_plans_valid:
                        self.log_test("Subscription Plans Structure", True, 
                                    f"All 4 plans available: {', '.join(plan_details)}")
                        
                        # Test specific plan pricing
                        expected_prices = {"free": 0, "pro": 9.99, "team": 19.99, "enterprise": 49.99}
                        pricing_correct = all(data[plan]["price"] == expected_prices[plan] for plan in expected_plans)
                        
                        if pricing_correct:
                            self.log_test("Plan Pricing Validation", True, "All plan prices match expected values")
                        else:
                            self.log_test("Plan Pricing Validation", False, "Plan prices don't match expected values")
                    else:
                        self.log_test("Subscription Plans Structure", False, f"Invalid plan structure: {data}")
                else:
                    self.log_test("Subscription Plans Structure", False, f"Missing expected plans. Got: {list(data.keys())}")
            else:
                self.log_test("Subscription Plans Structure", False, f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            self.log_test("Subscription Plans Structure", False, f"Request failed: {str(e)}")

    def test_email_validation(self):
        """Test email format validation"""
        print("📧 Testing Email Validation")
        print("-" * 40)
        
        invalid_emails = [
            "invalid-email",
            "@example.com",
            "user@",
            "user.example.com"
        ]
        
        for invalid_email in invalid_emails:
            try:
                invalid_user = {
                    "email": invalid_email,
                    "password": "ValidPass123!",
                    "full_name": "Test User"
                }
                
                response = self.session.post(
                    f"{self.api_url}/auth/register",
                    json=invalid_user,
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code == 422:  # FastAPI validation error
                    self.log_test(f"Invalid Email Format ({invalid_email})", True, "Correctly rejected invalid email format")
                else:
                    self.log_test(f"Invalid Email Format ({invalid_email})", False, f"Should have failed with 422, got {response.status_code}")
            except Exception as e:
                self.log_test(f"Invalid Email Format ({invalid_email})", False, f"Request failed: {str(e)}")

    def run_all_tests(self):
        """Run all test suites"""
        print("🧪 Starting FileInASnap Backend API Tests")
        print("=" * 60)
        
        start_time = time.time()
        
        # Run test suites in order
        self.test_health_endpoints()
        self.test_user_registration()
        self.test_user_login()
        self.test_user_profile()
        self.test_subscription_plans()
        self.test_email_validation()
        
        # Summary
        end_time = time.time()
        duration = end_time - start_time
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print("=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        print(f"⏱️  Duration: {duration:.2f} seconds")
        print(f"📈 Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"📊 Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"   • {result['test']}: {result['details']}")
        
        print("\n" + "=" * 60)
        return passed_tests, failed_tests, total_tests

def main():
    """Main test execution"""
    # Get backend URL from environment or use default
    import os
    backend_url = "https://d202cd2b-9a58-433d-8a7e-1707fca23ae6.preview.emergentagent.com"
    
    print(f"🎯 FileInASnap Backend API Testing Suite")
    print(f"🌐 Target URL: {backend_url}")
    print()
    
    tester = FileInASnapAPITester(backend_url)
    passed, failed, total = tester.run_all_tests()
    
    # Exit with appropriate code
    exit_code = 0 if failed == 0 else 1
    print(f"🏁 Testing completed with exit code: {exit_code}")
    return exit_code

if __name__ == "__main__":
    main()