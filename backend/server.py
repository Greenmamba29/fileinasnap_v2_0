from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from supabase import Client, create_client
from pydantic import BaseModel, EmailStr, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path
import os
import logging
import re
import uuid
import httpx
from jose import JWTError, jwt

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase Configuration
class SupabaseConfig:
    def __init__(self):
        self.url = os.getenv("SUPABASE_URL")
        self.anon_key = os.getenv("SUPABASE_ANON_KEY")
        self.service_key = os.getenv("SUPABASE_SERVICE_KEY")
        
        if not all([self.url, self.anon_key, self.service_key]):
            raise ValueError("Missing required Supabase configuration")
    
    def create_client(self, use_service_key: bool = False) -> Client:
        key = self.service_key if use_service_key else self.anon_key
        return create_client(self.url, key)

config = SupabaseConfig()
supabase_client = config.create_client()
admin_client = config.create_client(use_service_key=True)

# Create FastAPI app
app = FastAPI(title="FileInASnap API", version="1.0.0")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Pydantic Models
class UserRegistration(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    organization: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfile(BaseModel):
    id: str
    email: str
    full_name: str
    organization: Optional[str]
    subscription_tier: str
    created_at: str
    is_active: bool

# Authentication Service
class AuthenticationService:
    def __init__(self, supabase_client: Client):
        self.supabase = supabase_client
        self.jwks_url = f"{config.url}/auth/v1/.well-known/jwks.json"
        self.password_pattern = re.compile(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$')
    
    def validate_password(self, password: str) -> bool:
        return bool(self.password_pattern.match(password))
    
    async def verify_token(self, token: str) -> dict:
        try:
            # For development, we'll use a simpler approach
            # In production, you should verify against JWKS
            response = await httpx.AsyncClient().get(f"{config.url}/auth/v1/.well-known/jwks.json")
            if response.status_code == 200:
                # Token verification logic would go here
                # For now, we'll trust the token format
                pass
            
            # Decode without verification for development
            payload = jwt.decode(token, options={"verify_signature": False})
            return payload
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid authentication credentials: {str(e)}"
            )
    
    async def register_user(self, user_data: UserRegistration) -> dict:
        if not self.validate_password(user_data.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must contain at least 8 characters with uppercase, lowercase, number, and special character"
            )
        
        try:
            # Create user in Supabase Auth
            auth_response = self.supabase.auth.sign_up({
                "email": user_data.email,
                "password": user_data.password,
                "options": {
                    "data": {
                        "full_name": user_data.full_name,
                        "organization": user_data.organization
                    }
                }
            })
            
            if auth_response.user:
                return {
                    "message": "User registered successfully. Please check your email for verification.",
                    "user_id": auth_response.user.id
                }
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Registration failed"
                )
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Registration failed: {str(e)}"
            )
    
    async def authenticate_user(self, email: str, password: str) -> dict:
        try:
            response = self.supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            
            if response.user and response.session:
                return {
                    "access_token": response.session.access_token,
                    "refresh_token": response.session.refresh_token,
                    "user": {
                        "id": response.user.id,
                        "email": response.user.email,
                        "full_name": response.user.user_metadata.get("full_name", ""),
                        "organization": response.user.user_metadata.get("organization", "")
                    },
                    "token_type": "bearer"
                }
            else:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid credentials"
                )
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
    
    async def get_current_user(self, credentials: HTTPAuthorizationCredentials = Depends(security)):
        try:
            payload = await self.verify_token(credentials.credentials)
            user_id = payload.get("sub")
            
            if not user_id:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid user token"
                )
            
            # Get user details from Supabase
            user_response = self.supabase.auth.get_user(credentials.credentials)
            
            if user_response.user:
                return {
                    "id": user_response.user.id,
                    "email": user_response.user.email,
                    "full_name": user_response.user.user_metadata.get("full_name", ""),
                    "organization": user_response.user.user_metadata.get("organization", ""),
                    "subscription_tier": "free"  # Default for now
                }
            else:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )
                
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication"
            )

auth_service = AuthenticationService(supabase_client)

# API Routes
@api_router.get("/")
async def root():
    return {"message": "FileInASnap API - Powered by Supabase", "status": "healthy"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@api_router.post("/auth/register")
async def register(user_data: UserRegistration):
    result = await auth_service.register_user(user_data)
    return result

@api_router.post("/auth/login")
async def login(login_data: UserLogin):
    result = await auth_service.authenticate_user(login_data.email, login_data.password)
    return result

@api_router.get("/auth/profile")
async def get_profile(current_user: dict = Depends(auth_service.get_current_user)):
    return current_user

@api_router.get("/plans")
async def get_plans():
    """Get available subscription plans"""
    plans = {
        "free": {
            "name": "Free",
            "price": 0,
            "features": ["5 files", "Basic support", "1GB storage"],
            "max_files": 5,
            "storage_gb": 1
        },
        "pro": {
            "name": "Pro",
            "price": 9.99,
            "features": ["Unlimited files", "Priority support", "10GB storage", "Advanced analytics"],
            "max_files": -1,
            "storage_gb": 10
        },
        "team": {
            "name": "Team",
            "price": 19.99,
            "features": ["Everything in Pro", "Team collaboration", "50GB storage", "API access"],
            "max_files": -1,
            "storage_gb": 50
        },
        "enterprise": {
            "name": "Enterprise",
            "price": 49.99,
            "features": ["Everything in Team", "Custom integrations", "Unlimited storage", "24/7 support"],
            "max_files": -1,
            "storage_gb": -1
        }
    }
    return plans

# Include router in main app
app.include_router(api_router)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("FileInASnap API starting up with Supabase integration")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("FileInASnap API shutting down")
