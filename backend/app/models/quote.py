"""
Quote-related Pydantic models
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum
from .order import RepairService, PhoneModel


class QuoteStatus(str, Enum):
    """Quote status"""
    PENDING = "pending"
    CALCULATED = "calculated"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    EXPIRED = "expired"


class QuoteRequest(BaseModel):
    """Quote request model"""
    phone_model: str = Field(..., min_length=1, max_length=100)
    services: List[str] = Field(..., min_items=1)  # Service IDs
    symptoms: Optional[List[str]] = Field(None, max_items=10)
    additional_info: Optional[str] = Field(None, max_length=500)


class QuoteCalculation(BaseModel):
    """Quote calculation model"""
    phone_model: str
    services: List[RepairService]
    total_price: float = Field(..., gt=0)
    estimated_time: int = Field(..., gt=0)  # in hours
    warranty: int = Field(..., ge=1, le=24)  # in months
    breakdown: List[dict]  # Price breakdown by service


class QuoteResponse(BaseModel):
    """Quote response model"""
    id: str
    customer_id: str
    phone_model: str
    services: List[RepairService]
    total_price: float
    estimated_time: int
    warranty: int
    status: QuoteStatus
    breakdown: List[dict]
    valid_until: datetime
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class QuoteListResponse(BaseModel):
    """Quote list response with pagination"""
    quotes: List[QuoteResponse]
    total: int
    page: int
    limit: int
    has_next: bool
    has_prev: bool


class QuoteUpdate(BaseModel):
    """Quote update model"""
    status: Optional[QuoteStatus] = None
    notes: Optional[str] = Field(None, max_length=500)


class QuoteAcceptance(BaseModel):
    """Quote acceptance model"""
    quote_id: str
    customer_notes: Optional[str] = Field(None, max_length=500)
    preferred_date: Optional[datetime] = None


class PriceEstimate(BaseModel):
    """Price estimate model"""
    service_id: str
    base_price: float
    model_multiplier: float = 1.0
    complexity_factor: float = 1.0
    final_price: float
    estimated_time: int
    warranty_months: int


class QuoteSearchParams(BaseModel):
    """Quote search parameters"""
    customer_id: Optional[str] = None
    status: Optional[QuoteStatus] = None
    phone_model: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    page: int = Field(1, ge=1)
    limit: int = Field(20, ge=1, le=100)
    sort_by: str = Field("created_at", pattern="^(created_at|updated_at|total_price|status)$")
    sort_order: str = Field("desc", pattern="^(asc|desc)$")



