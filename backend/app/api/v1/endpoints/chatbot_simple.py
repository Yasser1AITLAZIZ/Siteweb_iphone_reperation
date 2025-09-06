"""
Simple Chatbot API endpoints (without RAG database dependency)
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import structlog
import google.generativeai as genai
from datetime import datetime

from app.core.config import settings
from app.core.security import get_current_user_optional
from app.models.chatbot import ChatRequest, ChatResponse

logger = structlog.get_logger()
router = APIRouter()

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)

@router.post("/query", response_model=ChatResponse)
async def chat_with_bot_simple(
    chat_request: ChatRequest,
    current_user: dict = Depends(get_current_user_optional)
):
    """
    Simple chat with the bot using Gemini directly (without RAG)
    """
    try:
        logger.info("Processing simple chat request", user_id=current_user["uid"] if current_user else None)
        
        # Create a context-aware prompt
        context_info = ""
        if current_user:
            context_info = f"User ID: {current_user['uid']}"
        
        # Create prompt for iPhone repair service
        prompt = f"""You are a helpful assistant for iRepair Pro, a professional iPhone repair service. 
        You specialize in iPhone repairs, troubleshooting, and providing helpful information about repair services.
        
        {context_info}
        
        User Question: {chat_request.message}
        
        Please provide a helpful, professional response about iPhone repair services. 
        If the question is not related to iPhone repair, politely redirect to iPhone repair topics.
        
        Answer:"""
        
        # Initialize Gemini model
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Generate response
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                max_output_tokens=1000,
                top_p=0.8,
                top_k=40
            )
        )
        
        # Build chat response
        chat_response = ChatResponse(
            message=response.text,
            session_id=chat_request.session_id or "default",
            timestamp=datetime.now(),
            confidence=0.8,  # High confidence for direct Gemini responses
            sources=[],  # No sources for direct responses
            metadata={
                "model": "gemini-1.5-flash",
                "temperature": 0.7,
                "response_type": "direct"
            }
        )
        
        logger.info("Simple chat response generated")
        return chat_response
        
    except Exception as e:
        logger.error("Simple chat error", error=str(e))
        
        # Handle Gemini API quota exceeded
        if "quota" in str(e).lower() or "429" in str(e):
            return ChatResponse(
                message="I'm currently experiencing high demand. Please try again later or contact our support team for immediate assistance.",
                session_id=chat_request.session_id or "default",
                timestamp=datetime.now(),
                confidence=0.1,
                sources=[],
                metadata={
                    "model": "gemini-1.5-flash",
                    "error": "quota_exceeded",
                    "response_type": "fallback"
                }
            )
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Chat service temporarily unavailable"
        )

@router.get("/health")
async def chatbot_health():
    """
    Check chatbot service health
    """
    try:
        # Test Gemini connection
        model = genai.GenerativeModel('gemini-1.5-flash')
        test_response = model.generate_content("Test")
        
        return {
            "status": "healthy",
            "service": "Simple Chatbot",
            "model": "gemini-1.5-flash",
            "gemini_connected": True
        }
    except Exception as e:
        logger.error("Chatbot health check failed", error=str(e))
        return {
            "status": "unhealthy",
            "service": "Simple Chatbot",
            "error": str(e)
        }
