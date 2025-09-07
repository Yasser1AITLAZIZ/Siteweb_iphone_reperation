"""
Supabase configuration and initialization
"""

from supabase import create_client, Client
from app.core.config import settings
import structlog
from typing import Optional, Dict, Any
import jwt
from datetime import datetime, timedelta

logger = structlog.get_logger()

# Global Supabase client
supabase: Optional[Client] = None


def initialize_supabase():
    """Initialize Supabase client"""
    global supabase
    
    try:
        if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
            logger.warning("Supabase URL and ANON_KEY not provided, using mock client")
            # Create a mock client for development
            supabase = None
            return
        
        supabase = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_ANON_KEY
        )
        
        logger.info("Supabase initialized successfully", url=settings.SUPABASE_URL)
        
    except Exception as e:
        logger.error("Failed to initialize Supabase", error=str(e))
        # Don't raise the error, just set to None for development
        supabase = None


def get_supabase_client() -> Optional[Client]:
    """Get Supabase client instance"""
    if supabase is None:
        logger.warning("Supabase not initialized, returning None")
        return None
    return supabase


async def verify_supabase_token(token: str) -> Dict[str, Any]:
    """Verify Supabase JWT token and return user info"""
    try:
        # Get the JWT secret from Supabase
        # In production, you should store this securely
        jwt_secret = settings.SUPABASE_SERVICE_ROLE_KEY
        
        # Decode the token
        decoded_token = jwt.decode(
            token, 
            jwt_secret, 
            algorithms=["HS256"],
            audience="authenticated"
        )
        
        return {
            "uid": decoded_token["sub"],
            "email": decoded_token.get("email"),
            "email_verified": decoded_token.get("email_verified", False),
            "name": decoded_token.get("user_metadata", {}).get("name"),
            "picture": decoded_token.get("user_metadata", {}).get("picture")
        }
    except jwt.ExpiredSignatureError:
        logger.error("Token has expired")
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError as e:
        logger.error("Invalid token", error=str(e))
        raise ValueError("Invalid token")
    except Exception as e:
        logger.error("Failed to verify Supabase token", error=str(e))
        raise ValueError("Token verification failed")


async def get_user_by_uid(uid: str) -> Dict[str, Any]:
    """Get user data from Supabase by UID"""
    try:
        client = get_supabase_client()
        
        # Get user from auth.users table
        response = client.auth.admin.get_user_by_id(uid)
        
        if not response.user:
            raise ValueError("User not found")
        
        # Get additional user data from profiles table
        profile_response = client.table("profiles").select("*").eq("id", uid).execute()
        
        profile_data = profile_response.data[0] if profile_response.data else {}
        
        return {
            "uid": uid,
            "email": response.user.email,
            "email_verified": response.user.email_confirmed_at is not None,
            "name": profile_data.get("name", ""),
            "phone": profile_data.get("phone", ""),
            "role": profile_data.get("role", "customer"),
            "status": profile_data.get("status", "active"),
            "created_at": response.user.created_at,
            "updated_at": profile_data.get("updated_at", response.user.updated_at)
        }
        
    except Exception as e:
        logger.error("Failed to get user by UID", uid=uid, error=str(e))
        raise


async def create_user_profile(uid: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
    """Create user profile in Supabase"""
    try:
        client = get_supabase_client()
        
        # Insert into profiles table
        profile_data = {
            "id": uid,
            "name": user_data.get("name", ""),
            "phone": user_data.get("phone", ""),
            "role": user_data.get("role", "customer"),
            "status": user_data.get("status", "active"),
            "address": user_data.get("address"),
            "permissions": user_data.get("permissions", []),
            "preferences": user_data.get("preferences", {}),
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        
        response = client.table("profiles").insert(profile_data).execute()
        
        if not response.data:
            raise ValueError("Failed to create user profile")
        
        logger.info("User profile created", uid=uid)
        return {"uid": uid, **profile_data}
        
    except Exception as e:
        logger.error("Failed to create user profile", uid=uid, error=str(e))
        raise


async def update_user_profile(uid: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
    """Update user profile in Supabase"""
    try:
        client = get_supabase_client()
        
        # Prepare update data
        update_data = {
            **user_data,
            "updated_at": datetime.now().isoformat()
        }
        
        # Update profiles table
        response = client.table("profiles").update(update_data).eq("id", uid).execute()
        
        if not response.data:
            raise ValueError("User not found")
        
        logger.info("User profile updated", uid=uid)
        return {"uid": uid, **response.data[0]}
        
    except Exception as e:
        logger.error("Failed to update user profile", uid=uid, error=str(e))
        raise


async def create_user_with_email_and_password(email: str, password: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
    """Create user with email and password in Supabase"""
    try:
        client = get_supabase_client()
        
        # Create user in Supabase Auth
        auth_response = client.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": {
                    "name": user_data.get("name", ""),
                    "phone": user_data.get("phone", "")
                }
            }
        })
        
        if not auth_response.user:
            raise ValueError("Failed to create user")
        
        # Create user profile
        profile_data = {
            "name": user_data.get("name", ""),
            "phone": user_data.get("phone", ""),
            "role": user_data.get("role", "customer"),
            "status": "active",
            "address": user_data.get("address"),
            "permissions": user_data.get("permissions", []),
            "preferences": user_data.get("preferences", {}),
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        
        profile_response = client.table("profiles").insert({
            "id": auth_response.user.id,
            **profile_data
        }).execute()
        
        if not profile_response.data:
            raise ValueError("Failed to create user profile")
        
        logger.info("User created successfully", uid=auth_response.user.id)
        return {
            "uid": auth_response.user.id,
            "email": auth_response.user.email,
            "email_verified": auth_response.user.email_confirmed_at is not None,
            **profile_data
        }
        
    except Exception as e:
        logger.error("Failed to create user with email and password", error=str(e))
        raise


async def sign_in_with_email_and_password(email: str, password: str) -> Dict[str, Any]:
    """Sign in user with email and password"""
    try:
        client = get_supabase_client()
        
        # Sign in user
        auth_response = client.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        if not auth_response.user:
            raise ValueError("Invalid credentials")
        
        # Get user profile
        profile_response = client.table("profiles").select("*").eq("id", auth_response.user.id).execute()
        
        profile_data = profile_response.data[0] if profile_response.data else {}
        
        return {
            "uid": auth_response.user.id,
            "email": auth_response.user.email,
            "email_verified": auth_response.user.email_confirmed_at is not None,
            "name": profile_data.get("name", ""),
            "phone": profile_data.get("phone", ""),
            "role": profile_data.get("role", "customer"),
            "status": profile_data.get("status", "active"),
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token
        }
        
    except Exception as e:
        logger.error("Failed to sign in user", error=str(e))
        raise


async def sign_out_user(access_token: str) -> bool:
    """Sign out user"""
    try:
        client = get_supabase_client()
        
        # Sign out user
        client.auth.sign_out()
        
        logger.info("User signed out successfully")
        return True
        
    except Exception as e:
        logger.error("Failed to sign out user", error=str(e))
        raise
