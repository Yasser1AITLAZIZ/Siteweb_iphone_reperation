"""
API v1 router configuration
"""

from fastapi import APIRouter
from app.api.v1.endpoints import orders, quotes, users, chatbot

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(quotes.router, prefix="/quotes", tags=["quotes"])
api_router.include_router(chatbot.router, prefix="/chatbot", tags=["chatbot"])


