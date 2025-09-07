"""
Security utilities and authentication middleware
"""

from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import structlog
from app.core.supabase import verify_supabase_token, get_user_by_uid

logger = structlog.get_logger()

# HTTP Bearer token scheme
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Get current authenticated user from Supabase token
    """
    try:
        # Verify Supabase token
        token_data = await verify_supabase_token(credentials.credentials)
        
        # Get user profile from Supabase
        user_data = await get_user_by_uid(token_data["uid"])
        
        return user_data
        
    except ValueError as e:
        logger.warning("Invalid authentication token", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        logger.error("Authentication error", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))
) -> Optional[dict]:
    """
    Get current user if authenticated, otherwise return None
    """
    if not credentials:
        return None
    
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None


def require_permissions(required_permissions: list):
    """
    Decorator to require specific permissions
    """
    def permission_checker(current_user: dict = Depends(get_current_user)):
        user_permissions = current_user.get("permissions", [])
        
        if not any(perm in user_permissions for perm in required_permissions):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        
        return current_user
    
    return permission_checker


def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    """
    Require admin role
    """
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    return current_user


def require_customer(current_user: dict = Depends(get_current_user)) -> dict:
    """
    Require customer role
    """
    if current_user.get("role") not in ["customer", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Customer access required"
        )
    
    return current_user


def require_technician(current_user: dict = Depends(get_current_user)) -> dict:
    """
    Require technician role
    """
    if current_user.get("role") not in ["technician", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Technician access required"
        )
    
    return current_user


class RateLimiter:
    """
    Simple in-memory rate limiter
    """
    def __init__(self, max_requests: int = 100, window: int = 60):
        self.max_requests = max_requests
        self.window = window
        self.requests = {}
    
    def is_allowed(self, identifier: str) -> bool:
        """
        Check if request is allowed for given identifier
        """
        import time
        current_time = time.time()
        
        # Clean old entries
        self.requests = {
            key: requests for key, requests in self.requests.items()
            if current_time - requests["first_request"] < self.window
        }
        
        # Check current identifier
        if identifier not in self.requests:
            self.requests[identifier] = {
                "count": 1,
                "first_request": current_time
            }
            return True
        
        request_data = self.requests[identifier]
        
        if current_time - request_data["first_request"] >= self.window:
            # Reset window
            self.requests[identifier] = {
                "count": 1,
                "first_request": current_time
            }
            return True
        
        if request_data["count"] >= self.max_requests:
            return False
        
        request_data["count"] += 1
        return True


# Global rate limiter instance
rate_limiter = RateLimiter()




