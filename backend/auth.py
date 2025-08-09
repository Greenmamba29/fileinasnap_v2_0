"""
Auth0 Authentication Module for FileInASnap
Handles JWT validation and user authentication using Auth0
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from typing import Dict, Optional
import jwt
import httpx
import os
from dotenv import load_dotenv
import logging

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

security = HTTPBearer()

class Auth0Config:
    def __init__(self):
        self.domain = os.getenv("AUTH0_DOMAIN")
        self.audience = os.getenv("AUTH0_AUDIENCE") 
        self.client_id = os.getenv("AUTH0_CLIENT_ID")
        self.client_secret = os.getenv("AUTH0_CLIENT_SECRET")
        
        if not all([self.domain, self.audience, self.client_id]):
            raise ValueError("Missing required Auth0 configuration")
        
        self.jwks_url = f"https://{self.domain}/.well-known/jwks.json"
        self.issuer = f"https://{self.domain}/"

auth0_config = Auth0Config()

class Auth0TokenValidator:
    def __init__(self):
        self.jwks_cache = None
        self.cache_expiry = None

    async def get_jwks(self) -> Dict:
        """Get JSON Web Key Set from Auth0 with caching"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(auth0_config.jwks_url)
                response.raise_for_status()
                return response.json()
        except Exception as e:
            logger.error(f"Failed to fetch JWKS: {e}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Unable to verify token signature"
            )

    async def validate_token(self, token: str) -> Dict:
        """Validate JWT token against Auth0"""
        try:
            # Get JWKS for signature verification
            jwks = await self.get_jwks()
            
            # Decode token without verification first to get header
            unverified_header = jwt.get_unverified_header(token)
            
            # Find the correct key
            rsa_key = None
            for key in jwks["keys"]:
                if key["kid"] == unverified_header["kid"]:
                    rsa_key = {
                        "kty": key["kty"],
                        "kid": key["kid"], 
                        "use": key["use"],
                        "n": key["n"],
                        "e": key["e"]
                    }
                    break
            
            if not rsa_key:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Unable to find appropriate key"
                )

            # Verify and decode the token
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=["RS256"],
                audience=auth0_config.audience,
                issuer=auth0_config.issuer,
                options={"verify_exp": True, "verify_aud": True, "verify_iss": True}
            )
            
            return payload
            
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired"
            )
        except jwt.JWTClaimsError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid token claims"
            )
        except jwt.JWTError as e:
            logger.error(f"JWT validation error: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

token_validator = Auth0TokenValidator()

async def get_current_user(credentials: HTTPBearer = Depends(security)) -> Dict:
    """
    Extract and validate current user from Auth0 JWT token
    Returns user information for use in protected routes
    """
    try:
        # Validate the token
        payload = await token_validator.validate_token(credentials.credentials)
        
        # Extract user information
        user_info = {
            "user_id": payload.get("sub"),
            "email": payload.get("email"),
            "email_verified": payload.get("email_verified", False),
            "name": payload.get("name"),
            "picture": payload.get("picture"),
            "permissions": payload.get("permissions", []),
            "scope": payload.get("scope", "").split()
        }
        
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

def require_permission(required_permission: str):
    """
    Decorator factory for requiring specific permissions
    Usage: @require_permission("read:files")
    """
    async def permission_checker(current_user: Dict = Depends(get_current_user)):
        permissions = current_user.get("permissions", [])
        
        if required_permission not in permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required: {required_permission}"
            )
        
        return current_user
    
    return permission_checker

def require_scope(required_scope: str):
    """
    Decorator factory for requiring specific OAuth scopes
    Usage: @require_scope("read:profile")
    """
    async def scope_checker(current_user: Dict = Depends(get_current_user)):
        scopes = current_user.get("scope", [])
        
        if required_scope not in scopes:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient scope. Required: {required_scope}"
            )
        
        return current_user
    
    return scope_checker

# Optional: Auth0 Management API client for admin operations
class Auth0ManagementClient:
    def __init__(self):
        self.domain = auth0_config.domain
        self.management_token = os.getenv("AUTH0_MANAGEMENT_API_TOKEN")
        self.base_url = f"https://{self.domain}/api/v2"
        
    async def get_user(self, user_id: str) -> Optional[Dict]:
        """Get user details from Auth0 Management API"""
        try:
            headers = {"Authorization": f"Bearer {self.management_token}"}
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/users/{user_id}",
                    headers=headers
                )
                
                if response.status_code == 200:
                    return response.json()
                elif response.status_code == 404:
                    return None
                else:
                    logger.error(f"Auth0 Management API error: {response.status_code}")
                    return None
                    
        except Exception as e:
            logger.error(f"Error fetching user from Auth0: {e}")
            return None
    
    async def update_user_metadata(self, user_id: str, metadata: Dict) -> bool:
        """Update user metadata in Auth0"""
        try:
            headers = {
                "Authorization": f"Bearer {self.management_token}",
                "Content-Type": "application/json"
            }
            
            payload = {"user_metadata": metadata}
            
            async with httpx.AsyncClient() as client:
                response = await client.patch(
                    f"{self.base_url}/users/{user_id}",
                    headers=headers,
                    json=payload
                )
                
                return response.status_code == 200
                
        except Exception as e:
            logger.error(f"Error updating user metadata: {e}")
            return False

auth0_management = Auth0ManagementClient()