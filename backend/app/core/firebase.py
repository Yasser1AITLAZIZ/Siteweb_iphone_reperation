"""
Firebase configuration and initialization
"""

import firebase_admin
from firebase_admin import credentials, firestore, auth
from app.core.config import settings
import structlog

logger = structlog.get_logger()

# Global Firebase instances
db: firestore.Client = None
auth_client = None


def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    global db, auth_client
    
    try:
        # Check if Firebase is already initialized
        if firebase_admin._apps:
            logger.info("Firebase already initialized")
            db = firestore.client()
            auth_client = auth
            return
        
        # Initialize Firebase Admin SDK
        if settings.FIREBASE_PRIVATE_KEY:
            # Use service account credentials
            cred = credentials.Certificate({
                "type": "service_account",
                "project_id": settings.FIREBASE_PROJECT_ID,
                "private_key_id": settings.FIREBASE_PRIVATE_KEY_ID,
                "private_key": settings.FIREBASE_PRIVATE_KEY.replace('\\n', '\n'),
                "client_email": settings.FIREBASE_CLIENT_EMAIL,
                "client_id": settings.FIREBASE_CLIENT_ID,
                "auth_uri": settings.FIREBASE_AUTH_URI,
                "token_uri": settings.FIREBASE_TOKEN_URI,
                "auth_provider_x509_cert_url": settings.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
                "client_x509_cert_url": settings.FIREBASE_CLIENT_X509_CERT_URL
            })
        else:
            # Use default credentials (for local development)
            cred = credentials.ApplicationDefault()
        
        # Initialize the app
        firebase_admin.initialize_app(cred, {
            'projectId': settings.FIREBASE_PROJECT_ID
        })
        
        # Get Firestore client
        db = firestore.client()
        auth_client = auth
        
        logger.info("Firebase initialized successfully", project_id=settings.FIREBASE_PROJECT_ID)
        
    except Exception as e:
        logger.error("Failed to initialize Firebase", error=str(e))
        raise


def get_firestore_client() -> firestore.Client:
    """Get Firestore client instance"""
    if db is None:
        raise RuntimeError("Firebase not initialized. Call initialize_firebase() first.")
    return db


def get_auth_client():
    """Get Firebase Auth client instance"""
    if auth_client is None:
        raise RuntimeError("Firebase not initialized. Call initialize_firebase() first.")
    return auth_client


async def verify_firebase_token(token: str) -> dict:
    """Verify Firebase ID token and return user info"""
    try:
        decoded_token = auth_client.verify_id_token(token)
        return {
            "uid": decoded_token["uid"],
            "email": decoded_token.get("email"),
            "email_verified": decoded_token.get("email_verified", False),
            "name": decoded_token.get("name"),
            "picture": decoded_token.get("picture")
        }
    except Exception as e:
        logger.error("Failed to verify Firebase token", error=str(e))
        raise ValueError("Invalid token")


async def get_user_by_uid(uid: str) -> dict:
    """Get user data from Firestore by UID"""
    try:
        user_doc = get_firestore_client().collection("users").document(uid).get()
        if user_doc.exists:
            return {"uid": uid, **user_doc.to_dict()}
        else:
            raise ValueError("User not found")
    except Exception as e:
        logger.error("Failed to get user by UID", uid=uid, error=str(e))
        raise


async def create_user_profile(uid: str, user_data: dict) -> dict:
    """Create user profile in Firestore"""
    try:
        user_ref = get_firestore_client().collection("users").document(uid)
        user_ref.set({
            **user_data,
            "created_at": firestore.SERVER_TIMESTAMP,
            "updated_at": firestore.SERVER_TIMESTAMP
        })
        
        logger.info("User profile created", uid=uid)
        return {"uid": uid, **user_data}
    except Exception as e:
        logger.error("Failed to create user profile", uid=uid, error=str(e))
        raise


async def update_user_profile(uid: str, user_data: dict) -> dict:
    """Update user profile in Firestore"""
    try:
        user_ref = get_firestore_client().collection("users").document(uid)
        user_ref.update({
            **user_data,
            "updated_at": firestore.SERVER_TIMESTAMP
        })
        
        logger.info("User profile updated", uid=uid)
        return {"uid": uid, **user_data}
    except Exception as e:
        logger.error("Failed to update user profile", uid=uid, error=str(e))
        raise




