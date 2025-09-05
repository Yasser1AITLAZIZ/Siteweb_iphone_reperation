"""
Chatbot-related Pydantic models
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class MessageType(str, Enum):
    """Message types"""
    USER = "user"
    BOT = "bot"
    SYSTEM = "system"


class MessageSender(str, Enum):
    """Message sender types"""
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class ChatMessage(BaseModel):
    """Chat message model"""
    id: str
    text: str = Field(..., min_length=1, max_length=2000)
    sender: MessageSender
    timestamp: datetime
    message_type: MessageType = MessageType.USER
    metadata: Optional[Dict[str, Any]] = None


class ChatRequest(BaseModel):
    """Chat request model"""
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None
    previous_messages: Optional[List[ChatMessage]] = None


class ChatResponse(BaseModel):
    """Chat response model"""
    message: str
    session_id: str
    timestamp: datetime
    sources: Optional[List[Dict[str, Any]]] = None
    confidence: Optional[float] = Field(None, ge=0.0, le=1.0)
    metadata: Optional[Dict[str, Any]] = None


class RAGQuery(BaseModel):
    """RAG query model"""
    question: str = Field(..., min_length=1, max_length=1000)
    context: Optional[Dict[str, Any]] = None
    limit: int = Field(5, ge=1, le=20)
    threshold: float = Field(0.7, ge=0.0, le=1.0)


class RAGResponse(BaseModel):
    """RAG response model"""
    answer: str
    sources: List[Dict[str, Any]]
    confidence: float = Field(..., ge=0.0, le=1.0)
    query_time: float  # in seconds
    metadata: Optional[Dict[str, Any]] = None


class KnowledgeDocument(BaseModel):
    """Knowledge document model"""
    id: str
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1, max_length=10000)
    category: str = Field(..., min_length=1, max_length=100)
    tags: List[str] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    is_active: bool = True
    created_at: datetime
    updated_at: datetime


class KnowledgeUpdate(BaseModel):
    """Knowledge base update model"""
    documents: List[KnowledgeDocument]
    update_type: str = Field(..., pattern="^(add|update|delete)$")


class ChatSession(BaseModel):
    """Chat session model"""
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    message_count: int = 0
    is_active: bool = True
    metadata: Optional[Dict[str, Any]] = None


class ChatHistory(BaseModel):
    """Chat history model"""
    session_id: str
    messages: List[ChatMessage]
    total_messages: int
    created_at: datetime
    last_message_at: datetime


class ChatAnalytics(BaseModel):
    """Chat analytics model"""
    total_sessions: int
    total_messages: int
    average_session_length: float
    most_common_questions: List[Dict[str, Any]]
    response_time_avg: float
    satisfaction_score: Optional[float] = None


class ChatbotConfig(BaseModel):
    """Chatbot configuration model"""
    model: str = "gpt-4"
    temperature: float = Field(0.7, ge=0.0, le=2.0)
    max_tokens: int = Field(1000, ge=100, le=4000)
    system_prompt: str = Field(..., min_length=1, max_length=2000)
    knowledge_base_enabled: bool = True
    fallback_enabled: bool = True


