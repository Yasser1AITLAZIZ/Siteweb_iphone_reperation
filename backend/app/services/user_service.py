"""
User service for managing user profiles and authentication
"""

from typing import Optional, Dict, Any
from datetime import datetime
import structlog

from app.core.firebase import get_firestore_client, get_auth_client
from app.core.exceptions import NotFoundError, ValidationError, DatabaseError
from app.models.user import UserResponse, UserUpdate, UserProfile

logger = structlog.get_logger()


class UserService:
    """Service for managing user profiles"""
    
    def __init__(self):
        self.db = get_firestore_client()
        self.auth = get_auth_client()
        self.collection = "users"
    
    async def get_user_profile(self, user_id: str) -> UserProfile:
        """
        Get user profile with extended information
        """
        try:
            # Get user document
            user_doc = self.db.collection(self.collection).document(user_id).get()
            
            if not user_doc.exists:
                raise NotFoundError("User", user_id)
            
            user_data = user_doc.to_dict()
            
            # Get user statistics
            stats = await self._get_user_statistics(user_id)
            
            # Build user profile
            profile_data = {
                **user_data,
                "uid": user_id,
                "total_orders": stats["total_orders"],
                "total_spent": stats["total_spent"],
                "permissions": user_data.get("permissions", []),
                "preferences": user_data.get("preferences", {})
            }
            
            return UserProfile(**profile_data)
            
        except NotFoundError:
            raise
        except Exception as e:
            logger.error("Failed to get user profile", user_id=user_id, error=str(e))
            raise DatabaseError("get_profile", str(e))
    
    async def update_user_profile(self, user_id: str, update_data: UserUpdate) -> UserResponse:
        """
        Update user profile
        """
        try:
            # Get existing user
            user_doc = self.db.collection(self.collection).document(user_id).get()
            
            if not user_doc.exists:
                raise NotFoundError("User", user_id)
            
            # Prepare update data
            update_dict = {
                "updated_at": datetime.now()
            }
            
            if update_data.name:
                update_dict["name"] = update_data.name
            
            if update_data.phone:
                update_dict["phone"] = update_data.phone
            
            if update_data.address:
                update_dict["address"] = update_data.address.dict()
            
            if update_data.status:
                update_dict["status"] = update_data.status
            
            # Update document
            self.db.collection(self.collection).document(user_id).update(update_dict)
            
            # Get updated user
            updated_user = await self.get_user_profile(user_id)
            
            logger.info("User profile updated successfully", user_id=user_id)
            
            return updated_user
            
        except NotFoundError:
            raise
        except Exception as e:
            logger.error("Failed to update user profile", user_id=user_id, error=str(e))
            raise DatabaseError("update_profile", str(e))
    
    async def create_user_profile(self, user_id: str, user_data: Dict[str, Any]) -> UserResponse:
        """
        Create user profile
        """
        try:
            # Prepare user document
            user_doc = {
                "uid": user_id,
                "name": user_data.get("name", ""),
                "email": user_data.get("email", ""),
                "phone": user_data.get("phone", ""),
                "role": user_data.get("role", "customer"),
                "status": user_data.get("status", "active"),
                "address": user_data.get("address"),
                "permissions": user_data.get("permissions", []),
                "preferences": user_data.get("preferences", {}),
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            }
            
            # Save to Firestore
            self.db.collection(self.collection).document(user_id).set(user_doc)
            
            logger.info("User profile created successfully", user_id=user_id)
            
            return UserResponse(**user_doc)
            
        except Exception as e:
            logger.error("Failed to create user profile", user_id=user_id, error=str(e))
            raise DatabaseError("create_profile", str(e))
    
    async def delete_user_profile(self, user_id: str) -> bool:
        """
        Delete user profile (soft delete)
        """
        try:
            # Get existing user
            user_doc = self.db.collection(self.collection).document(user_id).get()
            
            if not user_doc.exists:
                raise NotFoundError("User", user_id)
            
            # Soft delete by setting status to inactive
            update_data = UserUpdate(status="inactive")
            await self.update_user_profile(user_id, update_data)
            
            logger.info("User profile deleted successfully", user_id=user_id)
            
            return True
            
        except NotFoundError:
            raise
        except Exception as e:
            logger.error("Failed to delete user profile", user_id=user_id, error=str(e))
            raise DatabaseError("delete_profile", str(e))
    
    async def get_user_by_email(self, email: str) -> Optional[UserResponse]:
        """
        Get user by email address
        """
        try:
            query = self.db.collection(self.collection).where("email", "==", email)
            docs = query.stream()
            
            for doc in docs:
                user_data = doc.to_dict()
                user_data["uid"] = doc.id
                return UserResponse(**user_data)
            
            return None
            
        except Exception as e:
            logger.error("Failed to get user by email", email=email, error=str(e))
            raise DatabaseError("get_by_email", str(e))
    
    async def update_user_preferences(self, user_id: str, preferences: Dict[str, Any]) -> UserResponse:
        """
        Update user preferences
        """
        try:
            # Get existing user
            user_doc = self.db.collection(self.collection).document(user_id).get()
            
            if not user_doc.exists:
                raise NotFoundError("User", user_id)
            
            # Update preferences
            self.db.collection(self.collection).document(user_id).update({
                "preferences": preferences,
                "updated_at": datetime.now()
            })
            
            # Get updated user
            updated_user = await self.get_user_profile(user_id)
            
            logger.info("User preferences updated successfully", user_id=user_id)
            
            return updated_user
            
        except NotFoundError:
            raise
        except Exception as e:
            logger.error("Failed to update user preferences", user_id=user_id, error=str(e))
            raise DatabaseError("update_preferences", str(e))
    
    async def _get_user_statistics(self, user_id: str) -> Dict[str, Any]:
        """
        Get user statistics (orders, spending, etc.)
        """
        try:
            # Get user orders
            orders_query = self.db.collection("orders").where("customer_id", "==", user_id)
            orders_docs = orders_query.stream()
            
            total_orders = 0
            total_spent = 0.0
            
            for doc in orders_docs:
                order_data = doc.to_dict()
                total_orders += 1
                total_spent += order_data.get("total_price", 0)
            
            return {
                "total_orders": total_orders,
                "total_spent": total_spent
            }
            
        except Exception as e:
            logger.error("Failed to get user statistics", user_id=user_id, error=str(e))
            return {
                "total_orders": 0,
                "total_spent": 0.0
            }
    
    async def search_users(
        self, 
        query: str, 
        limit: int = 20
    ) -> list[UserResponse]:
        """
        Search users by name or email
        """
        try:
            # Simple search implementation
            # In production, consider using Algolia or Elasticsearch
            
            users = []
            
            # Search by name
            name_query = self.db.collection(self.collection).where("name", ">=", query).where("name", "<=", query + "\uf8ff")
            name_docs = name_query.limit(limit).stream()
            
            for doc in name_docs:
                user_data = doc.to_dict()
                user_data["uid"] = doc.id
                users.append(UserResponse(**user_data))
            
            # Search by email if we haven't reached the limit
            if len(users) < limit:
                email_query = self.db.collection(self.collection).where("email", ">=", query).where("email", "<=", query + "\uf8ff")
                email_docs = email_query.limit(limit - len(users)).stream()
                
                for doc in email_docs:
                    user_data = doc.to_dict()
                    user_data["uid"] = doc.id
                    users.append(UserResponse(**user_data))
            
            return users
            
        except Exception as e:
            logger.error("Failed to search users", query=query, error=str(e))
            raise DatabaseError("search_users", str(e))


# Global user service instance
user_service = UserService()


