import os
import time
import jwt
import uuid
from datetime import datetime
from pathlib import Path
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, APIRouter, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from supabase import Client, create_client
from dotenv import load_dotenv
import logging

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Environment configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY") 
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "super-secret-jwt-token-with-at-least-32-characters-long")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# FastAPI app setup
app = FastAPI(title="FileInASnap API", version="2.0.0")
security = HTTPBearer()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic Models
class User(BaseModel):
    id: str

class FolderIn(BaseModel):
    name: str

class CompleteUploadIn(BaseModel):
    folder_id: str
    object_key: str
    filename: str
    bytes: int
    mime: Optional[str] = None

# Authentication dependency
def get_current_user(authorization: str = Depends(security)) -> User:
    """Extract user from Supabase JWT token"""
    if not authorization or not authorization.credentials.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    
    token = authorization.credentials.replace("Bearer ", "")
    
    try:
        payload = jwt.decode(
            token, 
            SUPABASE_JWT_SECRET, 
            algorithms=["HS256"], 
            options={"verify_aud": False}
        )
        user_id = payload.get("sub") or payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        
        return User(id=user_id)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Health check endpoint
@app.get("/health")
def health():
    """Health check endpoint"""
    return {"status": "ok", "time": int(time.time()), "service": "FileInASnap API"}

# DB health including storage bucket verification
@app.get("/db-health")
def db_health():
    try:
        # Ping a simple select
        supabase.table("folders").select("id").limit(1).execute()
        # Ensure storage bucket exists
        buckets = supabase.storage.list_buckets()
        names = [b.get("name") for b in buckets]
        bucket_ok = "user-files" in names
        if not bucket_ok:
            # Attempt to create if missing (private by default)
            try:
                supabase.storage.create_bucket("user-files", public=False)
                bucket_ok = True
            except Exception:
                bucket_ok = False
        # Extra verification via RPC function (if present)
        rpc_ok = True
        try:
            rpc_result = supabase.rpc("health_check").execute()
            # Accept either boolean true or object with ok=true
            if rpc_result.data is not None:
                if isinstance(rpc_result.data, dict):
                    rpc_ok = bool(rpc_result.data.get("ok", True))
                else:
                    rpc_ok = bool(rpc_result.data)
        except Exception:
            rpc_ok = False
        return {"ok": True, "bucket_ok": bucket_ok, "rpc_ok": rpc_ok}
    except Exception as e:
        logger.error(f"DB health failed: {e}")
        return {"ok": False, "error": str(e)}

# Folder management endpoints
@app.get("/folders")
def list_folders(user: User = Depends(get_current_user)):
    """List user's folders"""
    try:
        result = supabase.table("folders").select("*").eq("owner_id", user.id).order("created_at", desc=False).execute()
        
        # Add file count for each folder
        folders = []
        for folder in result.data or []:
            file_count_result = supabase.table("files").select("id", count="exact").eq("folder_id", folder["id"]).execute()
            folder["file_count"] = file_count_result.count or 0
            folders.append(folder)
            
        return folders
    except Exception as e:
        logger.error(f"Error listing folders: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch folders")

@app.post("/folders")
def create_folder(body: FolderIn, user: User = Depends(get_current_user)):
    """Create a new folder"""
    try:
        folder_data = {
            "name": body.name,
            "owner_id": user.id,
            "created_at": datetime.utcnow().isoformat()
        }
        
        result = supabase.table("folders").insert(folder_data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create folder")
            
        return result.data[0]
    except Exception as e:
        logger.error(f"Error creating folder: {e}")
        raise HTTPException(status_code=500, detail="Failed to create folder")

# Upload endpoints with presigned URLs
@app.get("/uploads/presign")
def presign_upload(
    folder_id: str = Query(...), 
    filename: str = Query(...), 
    user: User = Depends(get_current_user)
):
    """Generate presigned URL for file upload"""
    try:
        # Verify folder exists and belongs to user
        folder_result = supabase.table("folders").select("*").eq("id", folder_id).eq("owner_id", user.id).execute()
        
        if not folder_result.data:
            raise HTTPException(status_code=404, detail="Folder not found")
        
        # Generate object key for Supabase storage
        object_key = f"{user.id}/{folder_id}/{filename}"
        
        # Create presigned upload URL using Supabase
        signed_result = supabase.storage.from_("user-files").create_signed_upload_url(object_key)
        
        return {
            "url": signed_result.get("signedUrl") or signed_result.get("signed_url"),
            "object_key": object_key
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating presigned URL: {e}")
        raise HTTPException(status_code=500, detail="Failed to create upload URL")

@app.post("/uploads/complete")
def complete_upload(body: CompleteUploadIn, user: User = Depends(get_current_user)):
    """Complete file upload by saving metadata"""
    try:
        # Verify folder exists and belongs to user
        folder_result = supabase.table("folders").select("*").eq("id", body.folder_id).eq("owner_id", user.id).execute()
        
        if not folder_result.data:
            raise HTTPException(status_code=404, detail="Folder not found")
        
        # Save file metadata
        file_data = {
            "folder_id": body.folder_id,
            "owner_id": user.id,
            "object_key": body.object_key,
            "filename": body.filename,
            "original_filename": body.filename,
            "bytes": body.bytes,
            "mime": body.mime,
            "created_at": datetime.utcnow().isoformat(),
            "status": "uploaded"
        }
        
        result = supabase.table("files").insert(file_data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to save file metadata")
        
        return {"ok": True, "file": result.data[0]}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error completing upload: {e}")
        raise HTTPException(status_code=500, detail="Failed to complete upload")

# File management endpoints
@app.get("/files")
def list_files(
    folder_id: Optional[str] = Query(None),
    limit: int = Query(50, le=200),
    user: User = Depends(get_current_user)
):
    """List user's files, optionally filtered by folder"""
    try:
        query = supabase.table("files").select("*").eq("owner_id", user.id)
        
        if folder_id:
            # Verify folder belongs to user
            folder_result = supabase.table("folders").select("*").eq("id", folder_id).eq("owner_id", user.id).execute()
            if not folder_result.data:
                raise HTTPException(status_code=404, detail="Folder not found")
            query = query.eq("folder_id", folder_id)
        
        result = query.order("created_at", desc=True).limit(limit).execute()
        
        return result.data or []
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error listing files: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch files")

@app.delete("/files/{file_id}")
def delete_file(file_id: str, user: User = Depends(get_current_user)):
    """Delete a file"""
    try:
        # Get file metadata
        file_result = supabase.table("files").select("*").eq("id", file_id).eq("owner_id", user.id).execute()
        
        if not file_result.data:
            raise HTTPException(status_code=404, detail="File not found")
        
        file_info = file_result.data[0]
        
        # Delete from storage
        try:
            supabase.storage.from_("user-files").remove([file_info["object_key"]])
        except Exception as e:
            logger.warning(f"Failed to delete from storage: {e}")
            # Continue with database deletion even if storage deletion fails
        
        # Delete from database
        supabase.table("files").delete().eq("id", file_id).eq("owner_id", user.id).execute()
        
        return {"ok": True, "message": "File deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting file: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete file")

# User stats endpoint
@app.get("/stats")
def get_user_stats(user: User = Depends(get_current_user)):
    """Get user statistics"""
    try:
        # Get folder count
        folders_result = supabase.table("folders").select("id", count="exact").eq("owner_id", user.id).execute()
        folder_count = folders_result.count or 0
        
        # Get file count and total size
        files_result = supabase.table("files").select("bytes").eq("owner_id", user.id).execute()
        file_count = len(files_result.data or [])
        total_bytes = sum(file.get("bytes", 0) for file in files_result.data or [])
        
        # Get file type breakdown
        type_counts = {}
        for file in files_result.data or []:
            mime = file.get("mime", "unknown")
            if mime:
                file_type = mime.split("/")[0]
                type_counts[file_type] = type_counts.get(file_type, 0) + 1
        
        return {
            "folders": folder_count,
            "files": file_count,
            "total_bytes": total_bytes,
            "total_mb": round(total_bytes / (1024 * 1024), 2),
            "type_breakdown": type_counts
        }
        
    except Exception as e:
        logger.error(f"Error getting stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch statistics")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8001))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
