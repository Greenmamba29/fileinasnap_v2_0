"""
Supabase Authentication Module for FileInASnap
Handles JWT validation and user authentication using Supabase Auth
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from typing import Dict, Optional
import jwt
import os
from dotenv import load_dotenv
import logging
from supabase import Client, create_client

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

security = HTTPBearer()

class SupabaseAuthConfig:
    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_anon_key = os.getenv("SUPABASE_ANON_KEY")
        self.supabase_service_key = os.getenv("SUPABASE_SERVICE_KEY")
        self.jwt_secret = os.getenv("SUPABASE_JWT_SECRET")
        
        if not all([self.supabase_url, self.supabase_anon_key]):
            raise ValueError("Missing required Supabase configuration")
        
        # Create Supabase clients
        self.supabase_client = create_client(self.supabase_url, self.supabase_anon_key)
        if self.supabase_service_key:
            self.supabase_admin = create_client(self.supabase_url, self.supabase_service_key)
        else:
            self.supabase_admin = None

supabase_auth_config = SupabaseAuthConfig()

class SupabaseTokenValidator:
    def __init__(self):
        self.supabase = supabase_auth_config.supabase_client
        self.admin_client = supabase_auth_config.supabase_admin

    async def validate_token(self, token: str) -> Dict:
        """Validate JWT token from Supabase Auth"""
        try:
            # Use Supabase client to verify the token
            user_response = self.supabase.auth.get_user(token)
            
            if user_response.user is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid or expired token"
                )
            
            user = user_response.user
            
            # Return standardized user info
            return {
                "user_id": user.id,
                "email": user.email,
                "email_verified": user.email_confirmed_at is not None,
                "name": user.user_metadata.get("full_name") or user.user_metadata.get("name"),
                "created_at": user.created_at,
                "last_sign_in": user.last_sign_in_at,
                "user_metadata": user.user_metadata,
                "app_metadata": user.app_metadata
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Token validation error: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate token"
            )

    async def get_user_by_id(self, user_id: str) -> Optional[Dict]:
        """Get user details by ID using admin client"""
        try:
            if not self.admin_client:
                logger.warning("Admin client not configured, using regular client")
                return None
                
            user_response = self.admin_client.auth.admin.get_user_by_id(user_id)
            
            if user_response.user:
                user = user_response.user
                return {
                    "user_id": user.id,
                    "email": user.email,
                    "email_verified": user.email_confirmed_at is not None,
                    "name": user.user_metadata.get("full_name") or user.user_metadata.get("name"),
                    "created_at": user.created_at,
                    "last_sign_in": user.last_sign_in_at,
                    "user_metadata": user.user_metadata,
                    "app_metadata": user.app_metadata
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Error fetching user by ID: {e}")
            return None

token_validator = SupabaseTokenValidator()

async def get_current_user(credentials: HTTPBearer = Depends(security)) -> Dict:
    """
    Extract and validate current user from Supabase JWT token
    Returns user information for use in protected routes
    """
    try:
        # Validate the token
        user_info = await token_validator.validate_token(credentials.credentials)
        
        # Ensure we have required fields
        if not user_info["user_id"]:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user ID in token"
            )
            
        return user_info
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error extracting user info: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

async def get_optional_user(credentials: HTTPBearer = Depends(security)) -> Optional[Dict]:
    """
    Optional authentication - returns user if token is valid, None otherwise
    Useful for endpoints that work with or without authentication
    """
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None

def require_user_role(required_role: str):
    """
    Decorator factory for requiring specific user roles
    Usage: @require_user_role("admin")
    """
    async def role_checker(current_user: Dict = Depends(get_current_user)):
        user_role = current_user.get("app_metadata", {}).get("role", "user")
        
        if user_role != required_role and user_role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required role: {required_role}"
            )
        
        return current_user
    
    return role_checker

def require_subscription_tier(required_tier: str):
    """
    Decorator factory for requiring specific subscription tiers
    Usage: @require_subscription_tier("pro")
    """
    async def tier_checker(current_user: Dict = Depends(get_current_user)):
        # We'll check the subscription tier from the user profile in database
        # This will be implemented when we update the user service
        return current_user
    
    return tier_checker

# Export commonly used functions
__all__ = [
    "get_current_user",
    "get_optional_user", 
    "require_user_role",
    "require_subscription_tier",
    "token_validator",
    "supabase_auth_config"
]
