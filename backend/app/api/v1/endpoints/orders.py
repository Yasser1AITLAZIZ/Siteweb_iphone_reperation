"""
Orders API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import structlog

from app.core.security import get_current_user, require_customer
from app.core.exceptions import NotFoundError, ValidationError, DatabaseError
from app.models.order import (
    OrderCreate, OrderUpdate, OrderResponse, OrderListResponse,
    OrderSearchParams, OrderTracking, OrderStatusUpdate
)
from app.services.order_service import get_order_service

logger = structlog.get_logger()
router = APIRouter()


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    current_user: dict = Depends(require_customer)
):
    """
    Create a new repair order
    """
    try:
        logger.info("Creating order", user_id=current_user["uid"])
        
        order = await get_order_service().create_order(order_data, current_user["uid"])
        
        logger.info("Order created successfully", order_id=order.id)
        return order
        
    except ValidationError as e:
        logger.warning("Order creation validation failed", error=str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except DatabaseError as e:
        logger.error("Order creation database error", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create order")


@router.get("/", response_model=OrderListResponse)
async def get_orders(
    search_params: OrderSearchParams = Depends(),
    current_user: dict = Depends(require_customer)
):
    """
    Get user's orders with pagination and filtering
    """
    try:
        logger.info("Getting orders", user_id=current_user["uid"], params=search_params.dict())
        
        orders = await get_order_service().get_orders(current_user["uid"], search_params)
        
        return orders
        
    except DatabaseError as e:
        logger.error("Failed to get orders", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve orders")


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    current_user: dict = Depends(require_customer)
):
    """
    Get a specific order by ID
    """
    try:
        logger.info("Getting order", order_id=order_id, user_id=current_user["uid"])
        
        order = await get_order_service().get_order(order_id, current_user["uid"])
        
        return order
        
    except NotFoundError as e:
        logger.warning("Order not found", order_id=order_id)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ValidationError as e:
        logger.warning("Order access denied", order_id=order_id, error=str(e))
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except DatabaseError as e:
        logger.error("Failed to get order", order_id=order_id, error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve order")


@router.put("/{order_id}", response_model=OrderResponse)
async def update_order(
    order_id: str,
    update_data: OrderUpdate,
    current_user: dict = Depends(require_customer)
):
    """
    Update an order
    """
    try:
        logger.info("Updating order", order_id=order_id, user_id=current_user["uid"])
        
        order = await get_order_service().update_order(order_id, update_data, current_user["uid"])
        
        logger.info("Order updated successfully", order_id=order_id)
        return order
        
    except NotFoundError as e:
        logger.warning("Order not found for update", order_id=order_id)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ValidationError as e:
        logger.warning("Order update validation failed", order_id=order_id, error=str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except DatabaseError as e:
        logger.error("Failed to update order", order_id=order_id, error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update order")


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_order(
    order_id: str,
    current_user: dict = Depends(require_customer)
):
    """
    Delete an order (soft delete)
    """
    try:
        logger.info("Deleting order", order_id=order_id, user_id=current_user["uid"])
        
        await get_order_service().delete_order(order_id, current_user["uid"])
        
        logger.info("Order deleted successfully", order_id=order_id)
        
    except NotFoundError as e:
        logger.warning("Order not found for deletion", order_id=order_id)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ValidationError as e:
        logger.warning("Order deletion validation failed", order_id=order_id, error=str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except DatabaseError as e:
        logger.error("Failed to delete order", order_id=order_id, error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete order")


@router.get("/tracking/{tracking_id}", response_model=OrderTracking)
async def track_order(tracking_id: str):
    """
    Track an order by tracking ID (public endpoint)
    """
    try:
        logger.info("Tracking order", tracking_id=tracking_id)
        
        tracking = await get_order_service().track_order(tracking_id)
        
        return tracking
        
    except NotFoundError as e:
        logger.warning("Order not found for tracking", tracking_id=tracking_id)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except DatabaseError as e:
        logger.error("Failed to track order", tracking_id=tracking_id, error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to track order")


@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: str,
    status_update: OrderStatusUpdate,
    current_user: dict = Depends(require_customer)
):
    """
    Update order status
    """
    try:
        logger.info("Updating order status", order_id=order_id, status=status_update.status)
        
        update_data = OrderUpdate(
            status=status_update.status,
            notes=status_update.notes,
            estimated_completion=status_update.estimated_completion
        )
        
        order = await get_order_service().update_order(order_id, update_data, current_user["uid"])
        
        logger.info("Order status updated successfully", order_id=order_id)
        return order
        
    except NotFoundError as e:
        logger.warning("Order not found for status update", order_id=order_id)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ValidationError as e:
        logger.warning("Order status update validation failed", order_id=order_id, error=str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except DatabaseError as e:
        logger.error("Failed to update order status", order_id=order_id, error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update order status")


