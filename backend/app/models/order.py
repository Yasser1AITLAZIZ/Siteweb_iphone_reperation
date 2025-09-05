"""
Order-related Pydantic models
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum
from .user import UserResponse, Address


class RepairStatus(str, Enum):
    """Repair order status"""
    RECEIVED = "recu"
    DIAGNOSTIC = "diagnostic"
    WAITING = "en_attente"
    IN_REPAIR = "en_reparation"
    READY = "pret"
    DELIVERED = "livre"
    CANCELLED = "annule"


class ServiceCategory(str, Enum):
    """Service categories"""
    SCREEN = "screen"
    BATTERY = "battery"
    CAMERA = "camera"
    AUDIO = "audio"
    CONNECTOR = "connector"
    OTHER = "other"


class RepairService(BaseModel):
    """Repair service model"""
    id: str
    name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=500)
    price: float = Field(..., gt=0)
    estimated_time: int = Field(..., gt=0)  # in hours
    category: ServiceCategory
    is_available: bool = True


class PhoneModel(BaseModel):
    """Phone model information"""
    id: str
    brand: str = Field(..., min_length=1, max_length=50)
    model: str = Field(..., min_length=1, max_length=100)
    year: int = Field(..., ge=2007, le=2024)
    is_supported: bool = True
    image_url: Optional[str] = None
    base_price: float = Field(..., ge=0)


class OrderBase(BaseModel):
    """Base order model"""
    phone_model: str = Field(..., min_length=1, max_length=100)
    serial_number: Optional[str] = Field(None, max_length=100)
    services: List[RepairService]
    notes: Optional[str] = Field(None, max_length=1000)
    customer_address: Optional[Address] = None


class OrderCreate(OrderBase):
    """Order creation model"""
    customer_id: str = Field(..., min_length=1)


class OrderUpdate(BaseModel):
    """Order update model"""
    status: Optional[RepairStatus] = None
    notes: Optional[str] = Field(None, max_length=1000)
    estimated_completion: Optional[datetime] = None
    services: Optional[List[RepairService]] = None


class OrderResponse(OrderBase):
    """Order response model"""
    id: str
    customer_id: str
    customer: UserResponse
    status: RepairStatus
    total_price: float
    estimated_completion: datetime
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None
    tracking_id: str
    
    class Config:
        from_attributes = True


class OrderListResponse(BaseModel):
    """Order list response with pagination"""
    orders: List[OrderResponse]
    total: int
    page: int
    limit: int
    has_next: bool
    has_prev: bool


class OrderTracking(BaseModel):
    """Order tracking information"""
    order_id: str
    tracking_id: str
    status: RepairStatus
    status_history: List[dict]
    estimated_completion: datetime
    current_location: Optional[str] = None
    last_updated: datetime


class OrderStatusUpdate(BaseModel):
    """Order status update model"""
    status: RepairStatus
    notes: Optional[str] = Field(None, max_length=500)
    estimated_completion: Optional[datetime] = None


class OrderSearchParams(BaseModel):
    """Order search parameters"""
    status: Optional[RepairStatus] = None
    customer_id: Optional[str] = None
    phone_model: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    page: int = Field(1, ge=1)
    limit: int = Field(20, ge=1, le=100)
    sort_by: str = Field("created_at", pattern="^(created_at|updated_at|total_price|status)$")
    sort_order: str = Field("desc", pattern="^(asc|desc)$")





