from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import HTTPBearer
from starlette.middleware.cors import CORSMiddleware
from supabase import Client, create_client
from pydantic import BaseModel, EmailStr, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path
import os
import logging
import uuid
import base64
import mimetypes
from auth import get_current_user, require_permission, auth0_management

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Supabase Configuration for data storage
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# Create FastAPI app
app = FastAPI(title="FileInASnap API", version="1.0.0")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Pydantic Models
class UserProfile(BaseModel):
    auth0_user_id: str
    email: str
    full_name: Optional[str] = None
    organization: Optional[str] = None
    subscription_tier: str = "free"
    profile_picture: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    organization: Optional[str] = None

class FileUpload(BaseModel):
    name: str
    content: str  # Base64 encoded content
    mime_type: str
    size: Optional[int] = None

class FileMetadata(BaseModel):
    id: str
    name: str
    mime_type: str
    size: int
    upload_date: str
    user_id: str

# User Service for managing user profiles
class UserService:
    def __init__(self, supabase_client: Client):
        self.supabase = supabase_client
    
    async def get_or_create_profile(self, auth0_user: Dict) -> Dict:
        """Get existing profile or create new one for Auth0 user"""
        try:
            # Check if profile exists
            existing_profile = self.supabase.table('user_profiles').select('*').eq('auth0_user_id', auth0_user['user_id']).execute()
            
            if existing_profile.data:
                return existing_profile.data[0]
            
            # Create new profile
            profile_data = {
                'id': str(uuid.uuid4()),
                'auth0_user_id': auth0_user['user_id'],
                'email': auth0_user['email'],
                'full_name': auth0_user.get('name'),
                'subscription_tier': 'free',
                'created_at': datetime.utcnow().isoformat(),
                'updated_at': datetime.utcnow().isoformat()
            }
            
            result = self.supabase.table('user_profiles').insert(profile_data).execute()
            return result.data[0] if result.data else profile_data
            
        except Exception as e:
            logging.error(f"Error managing user profile: {e}")
            raise HTTPException(status_code=500, detail="Profile management error")
    
    async def update_profile(self, auth0_user_id: str, profile_data: ProfileUpdate) -> Dict:
        """Update user profile"""
        try:
            update_data = profile_data.dict(exclude_unset=True)
            update_data['updated_at'] = datetime.utcnow().isoformat()
            
            result = self.supabase.table('user_profiles').update(update_data).eq('auth0_user_id', auth0_user_id).execute()
            return result.data[0] if result.data else None
            
        except Exception as e:
            logging.error(f"Error updating profile: {e}")
            raise HTTPException(status_code=500, detail="Profile update error")

# File Service for managing file uploads
class FileService:
    def __init__(self, supabase_client: Client):
        self.supabase = supabase_client
        self.max_file_size = 50 * 1024 * 1024  # 50MB limit
        self.allowed_types = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'application/pdf', 'text/plain', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'video/mp4', 'video/quicktime', 'video/x-msvideo'
        ]
    
    def validate_file(self, file_data: FileUpload) -> bool:
        """Validate file type and size"""
        if file_data.mime_type not in self.allowed_types:
            raise HTTPException(status_code=400, detail=f"File type {file_data.mime_type} not allowed")
        
        if file_data.size and file_data.size > self.max_file_size:
            raise HTTPException(status_code=400, detail=f"File size exceeds {self.max_file_size} bytes")
        
        return True
    
    async def upload_file(self, file_data: FileUpload, user_id: str) -> Dict:
        """Upload file to Supabase storage and save metadata"""
        try:
            self.validate_file(file_data)
            
            # Decode base64 content
            try:
                file_content = base64.b64decode(file_data.content)
                actual_size = len(file_content)
            except Exception as e:
                raise HTTPException(status_code=400, detail="Invalid base64 content")
            
            # Generate unique file ID and path
            file_id = str(uuid.uuid4())
            file_extension = mimetypes.guess_extension(file_data.mime_type) or ''
            file_path = f"{user_id}/{file_id}{file_extension}"
            
            # Upload to Supabase Storage
            storage_result = self.supabase.storage.from_('user-files').upload(
                file_path, file_content, 
                file_options={"content-type": file_data.mime_type}
            )
            
            # Save file metadata to database
            file_metadata = {
                'id': file_id,
                'user_id': user_id,
                'name': file_data.name,
                'original_name': file_data.name,
                'mime_type': file_data.mime_type,
                'size': actual_size,
                'storage_path': file_path,
                'upload_date': datetime.utcnow().isoformat(),
                'status': 'uploaded'
            }
            
            metadata_result = self.supabase.table('user_files').insert(file_metadata).execute()
            
            return {
                "file_id": file_id,
                "message": "File uploaded successfully",
                "metadata": metadata_result.data[0] if metadata_result.data else file_metadata
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logging.error(f"File upload error: {e}")
            raise HTTPException(status_code=500, detail="File upload failed")
    
    async def get_user_files(self, user_id: str, limit: int = 50) -> List[Dict]:
        """Get user's files"""
        try:
            result = self.supabase.table('user_files').select('*').eq('user_id', user_id).limit(limit).order('upload_date', desc=True).execute()
            return result.data or []
        except Exception as e:
            logging.error(f"Error fetching files: {e}")
            raise HTTPException(status_code=500, detail="Could not fetch files")
    
    async def delete_file(self, file_id: str, user_id: str) -> bool:
        """Delete user's file"""
        try:
            # Get file metadata
            file_result = self.supabase.table('user_files').select('*').eq('id', file_id).eq('user_id', user_id).execute()
            
            if not file_result.data:
                raise HTTPException(status_code=404, detail="File not found")
            
            file_info = file_result.data[0]
            
            # Delete from storage
            storage_result = self.supabase.storage.from_('user-files').remove([file_info['storage_path']])
            
            # Delete metadata
            metadata_result = self.supabase.table('user_files').delete().eq('id', file_id).eq('user_id', user_id).execute()
            
            return True
            
        except HTTPException:
            raise
        except Exception as e:
            logging.error(f"File deletion error: {e}")
            raise HTTPException(status_code=500, detail="File deletion failed")

# Initialize services
user_service = UserService(supabase)
file_service = FileService(supabase)

# API Routes
@api_router.get("/")
async def root():
    return {"message": "FileInASnap API - Powered by Auth0 + Supabase", "status": "healthy"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@api_router.get("/auth/profile")
async def get_profile(current_user: Dict = Depends(get_current_user)):
    """Get current user profile with Supabase data"""
    try:
        profile = await user_service.get_or_create_profile(current_user)
        
        return {
            "auth0_data": current_user,
            "profile_data": profile
        }
    except Exception as e:
        logging.error(f"Profile fetch error: {e}")
        raise HTTPException(status_code=500, detail="Could not fetch profile")

@api_router.put("/auth/profile")
async def update_profile(
    profile_data: ProfileUpdate,
    current_user: Dict = Depends(get_current_user)
):
    """Update user profile"""
    updated_profile = await user_service.update_profile(current_user['user_id'], profile_data)
    
    if not updated_profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    return {"message": "Profile updated successfully", "profile": updated_profile}

@api_router.get("/plans")
async def get_plans():
    """Get available subscription plans"""
    plans = {
        "free": {
            "name": "Free",
            "price": 0,
            "features": ["5 files", "Basic support", "1GB storage", "Basic AI organization"],
            "max_files": 5,
            "storage_gb": 1,
            "ai_features": ["basic_tagging"]
        },
        "pro": {
            "name": "Pro", 
            "price": 9.99,
            "features": ["100 files", "Priority support", "10GB storage", "Advanced AI", "File sharing"],
            "max_files": 100,
            "storage_gb": 10,
            "ai_features": ["advanced_tagging", "smart_search", "auto_categorization"]
        },
        "team": {
            "name": "Team",
            "price": 19.99,
            "features": ["500 files", "Team collaboration", "50GB storage", "API access", "Admin dashboard"],
            "max_files": 500,
            "storage_gb": 50,
            "ai_features": ["advanced_tagging", "smart_search", "auto_categorization", "team_insights"]
        },
        "enterprise": {
            "name": "Enterprise",
            "price": 49.99,
            "features": ["Unlimited files", "Custom integrations", "Unlimited storage", "24/7 support", "Advanced security"],
            "max_files": -1,
            "storage_gb": -1,
            "ai_features": ["all_features", "custom_models", "priority_processing"]
        }
    }
    return plans

# File Management Endpoints
@api_router.post("/files/upload")
async def upload_file(
    file_data: FileUpload,
    current_user: Dict = Depends(get_current_user)
):
    """Upload a new file"""
    # Get user profile to check limits
    profile = await user_service.get_or_create_profile(current_user)
    
    # Check file count limits based on subscription
    user_files = await file_service.get_user_files(current_user['user_id'])
    
    plans_response = await get_plans()
    user_plan = plans_response.get(profile['subscription_tier'], plans_response['free'])
    max_files = user_plan['max_files']
    
    if max_files != -1 and len(user_files) >= max_files:
        raise HTTPException(
            status_code=429, 
            detail=f"File limit exceeded. Your {profile['subscription_tier']} plan allows {max_files} files."
        )
    
    result = await file_service.upload_file(file_data, current_user['user_id'])
    return result

@api_router.get("/files")
async def get_files(
    limit: int = 50,
    current_user: Dict = Depends(get_current_user)
):
    """Get user's files"""
    files = await file_service.get_user_files(current_user['user_id'], limit)
    return {"files": files, "count": len(files)}

@api_router.delete("/files/{file_id}")
async def delete_file(
    file_id: str,
    current_user: Dict = Depends(get_current_user)
):
    """Delete a file"""
    success = await file_service.delete_file(file_id, current_user['user_id'])
    return {"message": "File deleted successfully" if success else "File deletion failed"}

# Analytics endpoint (Pro+ only)
@api_router.get("/analytics/usage")
async def get_usage_analytics(
    current_user: Dict = Depends(require_permission("read:analytics"))
):
    """Get usage analytics for Pro+ users"""
    profile = await user_service.get_or_create_profile(current_user)
    files = await file_service.get_user_files(current_user['user_id'], 1000)
    
    # Calculate usage statistics
    total_files = len(files)
    total_size = sum(f.get('size', 0) for f in files)
    total_size_gb = total_size / (1024 * 1024 * 1024)
    
    # File type breakdown
    type_breakdown = {}
    for file in files:
        mime_type = file.get('mime_type', 'unknown')
        type_category = mime_type.split('/')[0]
        type_breakdown[type_category] = type_breakdown.get(type_category, 0) + 1
    
    return {
        "user_id": current_user['user_id'],
        "subscription_tier": profile['subscription_tier'],
        "usage": {
            "total_files": total_files,
            "total_size_bytes": total_size,
            "total_size_gb": round(total_size_gb, 3),
            "type_breakdown": type_breakdown
        },
        "generated_at": datetime.utcnow().isoformat()
    }

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
    logger.info("FileInASnap API starting up with Auth0 + Supabase integration")
    
    # Create necessary database tables if they don't exist
    try:
        # This is a placeholder - in production you'd run proper migrations
        logger.info("Database tables ready")
    except Exception as e:
        logger.error(f"Database setup error: {e}")

@app.on_event("shutdown") 
async def shutdown_event():
    logger.info("FileInASnap API shutting down")
