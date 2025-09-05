"""
Users API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import structlog

from app.core.security import get_current_user, require_admin
from app.core.exceptions import NotFoundError, ValidationError, DatabaseError
from app.models.user import (
    UserResponse, UserUpdate, UserProfile, LoginRequest, LoginResponse,
    PasswordResetRequest, PasswordResetConfirm
)
from app.services.user_service import user_service

logger = structlog.get_logger()
router = APIRouter()


@router.get("/profile", response_model=UserProfile)
async def get_user_profile(
    current_user: dict = Depends(get_current_user)
):
    """
    Get current user's profile
    """
    try:
        logger.info("Getting user profile", user_id=current_user["uid"])
        
        profile = await user_service.get_user_profile(current_user["uid"])
        
        return profile
        
    except NotFoundError as e:
        logger.warning("User profile not found", user_id=current_user["uid"])
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except DatabaseError as e:
        logger.error("Failed to get user profile", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve profile")


@router.put("/profile", response_model=UserResponse)
async def update_user_profile(
    update_data: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    Update current user's profile
    """
    try:
        logger.info("Updating user profile", user_id=current_user["uid"])
        
        profile = await user_service.update_user_profile(current_user["uid"], update_data)
        
        logger.info("User profile updated successfully", user_id=current_user["uid"])
        return profile
        
    except NotFoundError as e:
        logger.warning("User profile not found for update", user_id=current_user["uid"])
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ValidationError as e:
        logger.warning("User profile update validation failed", error=str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except DatabaseError as e:
        logger.error("Failed to update user profile", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update profile")


@router.put("/preferences", response_model=UserResponse)
async def update_user_preferences(
    preferences: dict,
    current_user: dict = Depends(get_current_user)
):
    """
    Update user preferences
    """
    try:
        logger.info("Updating user preferences", user_id=current_user["uid"])
        
        profile = await user_service.update_user_preferences(current_user["uid"], preferences)
        
        logger.info("User preferences updated successfully", user_id=current_user["uid"])
        return profile
        
    except NotFoundError as e:
        logger.warning("User not found for preferences update", user_id=current_user["uid"])
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except DatabaseError as e:
        logger.error("Failed to update user preferences", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update preferences")


@router.get("/search", response_model=List[UserResponse])
async def search_users(
    query: str,
    limit: int = 20,
    current_user: dict = Depends(require_admin)
):
    """
    Search users by name or email (admin only)
    """
    try:
        logger.info("Searching users", query=query, admin_id=current_user["uid"])
        
        users = await user_service.search_users(query, limit)
        
        return users
        
    except DatabaseError as e:
        logger.error("Failed to search users", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to search users")


@router.delete("/profile", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_profile(
    current_user: dict = Depends(get_current_user)
):
    """
    Delete current user's profile (soft delete)
    """
    try:
        logger.info("Deleting user profile", user_id=current_user["uid"])
        
        await user_service.delete_user_profile(current_user["uid"])
        
        logger.info("User profile deleted successfully", user_id=current_user["uid"])
        
    except NotFoundError as e:
        logger.warning("User profile not found for deletion", user_id=current_user["uid"])
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except DatabaseError as e:
        logger.error("Failed to delete user profile", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete profile")


@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: str,
    current_user: dict = Depends(require_admin)
):
    """
    Get user by ID (admin only)
    """
    try:
        logger.info("Getting user by ID", user_id=user_id, admin_id=current_user["uid"])
        
        profile = await user_service.get_user_profile(user_id)
        
        return profile
        
    except NotFoundError as e:
        logger.warning("User not found", user_id=user_id)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except DatabaseError as e:
        logger.error("Failed to get user by ID", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve user")


@router.put("/{user_id}", response_model=UserResponse)
async def update_user_by_id(
    user_id: str,
    update_data: UserUpdate,
    current_user: dict = Depends(require_admin)
):
    """
    Update user by ID (admin only)
    """
    try:
        logger.info("Updating user by ID", user_id=user_id, admin_id=current_user["uid"])
        
        profile = await user_service.update_user_profile(user_id, update_data)
        
        logger.info("User updated successfully by admin", user_id=user_id)
        return profile
        
    except NotFoundError as e:
        logger.warning("User not found for admin update", user_id=user_id)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ValidationError as e:
        logger.warning("User update validation failed", error=str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except DatabaseError as e:
        logger.error("Failed to update user by admin", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update user")


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_by_id(
    user_id: str,
    current_user: dict = Depends(require_admin)
):
    """
    Delete user by ID (admin only)
    """
    try:
        logger.info("Deleting user by ID", user_id=user_id, admin_id=current_user["uid"])
        
        await user_service.delete_user_profile(user_id)
        
        logger.info("User deleted successfully by admin", user_id=user_id)
        
    except NotFoundError as e:
        logger.warning("User not found for admin deletion", user_id=user_id)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except DatabaseError as e:
        logger.error("Failed to delete user by admin", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete user")


