"""
Chatbot API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import structlog

from app.core.security import get_current_user, get_current_user_optional
from app.core.exceptions import RAGError, ValidationError
from app.models.chatbot import (
    ChatRequest, ChatResponse, RAGQuery, RAGResponse,
    KnowledgeDocument, ChatSession, ChatHistory
)
from app.services.rag_service import get_rag_service

logger = structlog.get_logger()
router = APIRouter()


@router.post("/query", response_model=ChatResponse)
async def chat_with_bot(
    chat_request: ChatRequest,
    current_user: dict = Depends(get_current_user_optional)
):
    """
    Chat with the RAG-powered bot
    """
    try:
        logger.info("Processing chat request", user_id=current_user["uid"] if current_user else None)
        
        # Prepare RAG query
        rag_query = RAGQuery(
            question=chat_request.message,
            context={
                "user_id": current_user["uid"] if current_user else None,
                "session_id": chat_request.session_id,
                "previous_messages": [msg.dict() for msg in chat_request.previous_messages] if chat_request.previous_messages else []
            } if current_user else None,
            limit=5,
            threshold=0.7
        )
        
        # Get RAG response
        rag_response = await get_rag_service().query(rag_query)
        
        # Build chat response
        from datetime import datetime
        chat_response = ChatResponse(
            message=rag_response.answer,
            session_id=chat_request.session_id or "default",
            timestamp=datetime.now(),
            sources=rag_response.sources,
            confidence=rag_response.confidence,
            metadata={
                "query_time": rag_response.query_time,
                "sources_count": len(rag_response.sources),
                "model": "gemini-1.5-flash"
            }
        )
        
        logger.info("Chat response generated", confidence=rag_response.confidence)
        return chat_response
        
    except RAGError as e:
        logger.error("RAG service error", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Chat service temporarily unavailable")
    except ValidationError as e:
        logger.warning("Chat request validation failed", error=str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error("Unexpected chat error", error=str(e), exc_info=True)
        # Return a more specific error for debugging
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Internal server error: {str(e)}"
        )


@router.post("/rag/query", response_model=RAGResponse)
async def rag_query(
    rag_query: RAGQuery,
    current_user: dict = Depends(get_current_user)
):
    """
    Direct RAG query endpoint
    """
    try:
        logger.info("Processing RAG query", user_id=current_user["uid"])
        
        # Enhance context with user information
        if rag_query.context is None:
            rag_query.context = {}
        
        rag_query.context["user_id"] = current_user["uid"]
        
        # Process RAG query
        response = await get_rag_service().query(rag_query)
        
        logger.info("RAG query processed", confidence=response.confidence)
        return response
        
    except RAGError as e:
        logger.error("RAG query failed", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    except Exception as e:
        logger.error("Unexpected RAG error", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.post("/knowledge/add")
async def add_knowledge_documents(
    documents: List[KnowledgeDocument],
    current_user: dict = Depends(get_current_user)
):
    """
    Add documents to the knowledge base (admin only)
    """
    try:
        # Check if user is admin
        if current_user.get("role") != "admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
        
        logger.info("Adding knowledge documents", count=len(documents), user_id=current_user["uid"])
        
        result = await get_rag_service().add_documents(documents)
        
        logger.info("Knowledge documents added successfully", result=result)
        return result
        
    except RAGError as e:
        logger.error("Failed to add knowledge documents", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    except Exception as e:
        logger.error("Unexpected knowledge addition error", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.put("/knowledge/update/{document_id}")
async def update_knowledge_document(
    document_id: str,
    document: KnowledgeDocument,
    current_user: dict = Depends(get_current_user)
):
    """
    Update a knowledge document (admin only)
    """
    try:
        # Check if user is admin
        if current_user.get("role") != "admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
        
        logger.info("Updating knowledge document", document_id=document_id, user_id=current_user["uid"])
        
        result = await get_rag_service().update_document(document)
        
        logger.info("Knowledge document updated successfully", document_id=document_id)
        return result
        
    except RAGError as e:
        logger.error("Failed to update knowledge document", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    except Exception as e:
        logger.error("Unexpected knowledge update error", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.delete("/knowledge/delete/{document_id}")
async def delete_knowledge_document(
    document_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a knowledge document (admin only)
    """
    try:
        # Check if user is admin
        if current_user.get("role") != "admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
        
        logger.info("Deleting knowledge document", document_id=document_id, user_id=current_user["uid"])
        
        result = await get_rag_service().delete_document(document_id)
        
        logger.info("Knowledge document deleted successfully", document_id=document_id)
        return result
        
    except RAGError as e:
        logger.error("Failed to delete knowledge document", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    except Exception as e:
        logger.error("Unexpected knowledge deletion error", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.get("/knowledge/search")
async def search_knowledge(
    query: str,
    limit: int = 5,
    current_user: dict = Depends(get_current_user)
):
    """
    Search the knowledge base
    """
    try:
        logger.info("Searching knowledge base", query=query, user_id=current_user["uid"])
        
        results = await get_rag_service().search_similar(query, limit)
        
        logger.info("Knowledge search completed", results_count=len(results))
        return {"results": results}
        
    except RAGError as e:
        logger.error("Knowledge search failed", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    except Exception as e:
        logger.error("Unexpected knowledge search error", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.get("/knowledge/stats")
async def get_knowledge_stats(
    current_user: dict = Depends(get_current_user)
):
    """
    Get knowledge base statistics (admin only)
    """
    try:
        # Check if user is admin
        if current_user.get("role") != "admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
        
        logger.info("Getting knowledge base stats", user_id=current_user["uid"])
        
        stats = await get_rag_service().get_knowledge_stats()
        
        return stats
        
    except RAGError as e:
        logger.error("Failed to get knowledge stats", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    except Exception as e:
        logger.error("Unexpected knowledge stats error", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


