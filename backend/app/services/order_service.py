"""
Order service for managing repair orders
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import structlog
import uuid

from app.core.supabase import get_supabase_client
from app.core.exceptions import NotFoundError, ValidationError, DatabaseError
from app.models.order import (
    OrderCreate, OrderUpdate, OrderResponse, OrderListResponse,
    OrderSearchParams, RepairStatus, OrderTracking
)

logger = structlog.get_logger()


class OrderService:
    """Service for managing repair orders"""
    
    def __init__(self):
        self.client = get_supabase_client()
        self.table = "orders"
    
    async def create_order(self, order_data: OrderCreate, user_id: str) -> OrderResponse:
        """
        Create a new repair order
        """
        try:
            logger.info("Creating new order", user_id=user_id)
            
            # Generate order ID and tracking ID
            order_id = str(uuid.uuid4())
            tracking_id = f"IRP{datetime.now().strftime('%Y%m%d')}{order_id[:8].upper()}"
            
            # Calculate total price
            total_price = sum(service.price for service in order_data.services)
            
            # Set estimated completion (default: 7 days from now)
            estimated_completion = datetime.now() + timedelta(days=7)
            
            # Prepare order document
            order_doc = {
                "id": order_id,
                "customer_id": user_id,
                "phone_model": order_data.phone_model,
                "serial_number": order_data.serial_number,
                "services": [service.dict() for service in order_data.services],
                "status": RepairStatus.RECEIVED,
                "total_price": total_price,
                "estimated_completion": estimated_completion.isoformat(),
                "notes": order_data.notes,
                "customer_address": order_data.customer_address.dict() if order_data.customer_address else None,
                "tracking_id": tracking_id,
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
            
            # Save to Supabase
            response = self.client.table(self.table).insert(order_doc).execute()
            
            if not response.data:
                raise DatabaseError("create", "Failed to create order")
            
            # Create status history entry
            status_history_data = {
                "order_id": order_id,
                "status": RepairStatus.RECEIVED,
                "notes": "Order received",
                "created_at": datetime.now().isoformat(),
                "created_by": user_id
            }
            
            self.client.table("order_status_history").insert(status_history_data).execute()
            
            # Get customer data
            customer_response = self.client.table("profiles").select("*").eq("id", user_id).execute()
            customer_data = customer_response.data[0] if customer_response.data else {}
            
            logger.info("Order created successfully", order_id=order_id, tracking_id=tracking_id)
            
            return OrderResponse(
                id=order_id,
                customer_id=user_id,
                customer=customer_data,
                phone_model=order_data.phone_model,
                serial_number=order_data.serial_number,
                services=order_data.services,
                status=RepairStatus.RECEIVED,
                total_price=total_price,
                estimated_completion=estimated_completion,
                notes=order_data.notes,
                customer_address=order_data.customer_address,
                tracking_id=tracking_id,
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            
        except Exception as e:
            logger.error("Failed to create order", error=str(e))
            raise DatabaseError("create", str(e))
    
    async def get_order(self, order_id: str, user_id: str) -> OrderResponse:
        """
        Get a specific order by ID
        """
        try:
            response = self.client.table(self.table).select("*").eq("id", order_id).execute()
            
            if not response.data:
                raise NotFoundError("Order", order_id)
            
            order_data = response.data[0]
            
            # Check if user has access to this order
            if order_data["customer_id"] != user_id:
                raise ValidationError("Access denied to this order")
            
            # Get customer data
            customer_response = self.client.table("profiles").select("*").eq("id", user_id).execute()
            customer_data = customer_response.data[0] if customer_response.data else {}
            
            return OrderResponse(**order_data, customer=customer_data)
            
        except NotFoundError:
            raise
        except ValidationError:
            raise
        except Exception as e:
            logger.error("Failed to get order", order_id=order_id, error=str(e))
            raise DatabaseError("get", str(e))
    
    async def get_orders(
        self, 
        user_id: str, 
        search_params: OrderSearchParams
    ) -> OrderListResponse:
        """
        Get orders with pagination and filtering
        """
        try:
            # Build query
            query = self.client.table(self.table).select("*").eq("customer_id", user_id)
            
            # Apply filters
            if search_params.status:
                query = query.eq("status", search_params.status)
            
            if search_params.phone_model:
                query = query.eq("phone_model", search_params.phone_model)
            
            if search_params.date_from:
                query = query.gte("created_at", search_params.date_from.isoformat())
            
            if search_params.date_to:
                query = query.lte("created_at", search_params.date_to.isoformat())
            
            # Apply sorting
            sort_field = search_params.sort_by
            sort_order = search_params.sort_order
            query = query.order(sort_field, desc=(sort_order == "desc"))
            
            # Apply pagination
            offset = (search_params.page - 1) * search_params.limit
            query = query.range(offset, offset + search_params.limit - 1)
            
            # Execute query
            response = query.execute()
            
            orders = []
            for order_data in response.data or []:
                # Get customer data
                customer_response = self.client.table("profiles").select("*").eq("id", user_id).execute()
                customer_data = customer_response.data[0] if customer_response.data else {}
                
                orders.append(OrderResponse(**order_data, customer=customer_data))
            
            # Get total count
            count_response = self.client.table(self.table).select("*", count="exact").eq("customer_id", user_id).execute()
            total = count_response.count or 0
            
            has_next = (search_params.page * search_params.limit) < total
            has_prev = search_params.page > 1
            
            return OrderListResponse(
                orders=orders,
                total=total,
                page=search_params.page,
                limit=search_params.limit,
                has_next=has_next,
                has_prev=has_prev
            )
            
        except Exception as e:
            logger.error("Failed to get orders", user_id=user_id, error=str(e))
            raise DatabaseError("list", str(e))
    
    async def update_order(
        self, 
        order_id: str, 
        update_data: OrderUpdate, 
        user_id: str
    ) -> OrderResponse:
        """
        Update an order
        """
        try:
            # Get existing order
            response = self.client.table(self.table).select("*").eq("id", order_id).execute()
            
            if not response.data:
                raise NotFoundError("Order", order_id)
            
            order_data = response.data[0]
            
            # Check if user has access to this order
            if order_data["customer_id"] != user_id:
                raise ValidationError("Access denied to this order")
            
            # Prepare update data
            update_dict = {
                "updated_at": datetime.now().isoformat()
            }
            
            if update_data.status:
                update_dict["status"] = update_data.status
                # Add to status history
                status_history_data = {
                    "order_id": order_id,
                    "status": update_data.status,
                    "notes": update_data.notes or f"Status updated to {update_data.status}",
                    "created_at": datetime.now().isoformat(),
                    "created_by": user_id
                }
                self.client.table("order_status_history").insert(status_history_data).execute()
            
            if update_data.notes:
                update_dict["notes"] = update_data.notes
            
            if update_data.estimated_completion:
                update_dict["estimated_completion"] = update_data.estimated_completion.isoformat()
            
            if update_data.services:
                update_dict["services"] = [service.dict() for service in update_data.services]
                # Recalculate total price
                total_price = sum(service.price for service in update_data.services)
                update_dict["total_price"] = total_price
            
            # Update document
            update_response = self.client.table(self.table).update(update_dict).eq("id", order_id).execute()
            
            if not update_response.data:
                raise DatabaseError("update", "Failed to update order")
            
            # Get updated order
            updated_order = await self.get_order(order_id, user_id)
            
            logger.info("Order updated successfully", order_id=order_id)
            
            return updated_order
            
        except NotFoundError:
            raise
        except ValidationError:
            raise
        except Exception as e:
            logger.error("Failed to update order", order_id=order_id, error=str(e))
            raise DatabaseError("update", str(e))
    
    async def delete_order(self, order_id: str, user_id: str) -> bool:
        """
        Delete an order (soft delete by setting status to cancelled)
        """
        try:
            # Get existing order
            response = self.client.table(self.table).select("*").eq("id", order_id).execute()
            
            if not response.data:
                raise NotFoundError("Order", order_id)
            
            order_data = response.data[0]
            
            # Check if user has access to this order
            if order_data["customer_id"] != user_id:
                raise ValidationError("Access denied to this order")
            
            # Soft delete by setting status to cancelled
            update_data = OrderUpdate(
                status=RepairStatus.CANCELLED,
                notes="Order cancelled by customer"
            )
            
            await self.update_order(order_id, update_data, user_id)
            
            logger.info("Order deleted successfully", order_id=order_id)
            
            return True
            
        except NotFoundError:
            raise
        except ValidationError:
            raise
        except Exception as e:
            logger.error("Failed to delete order", order_id=order_id, error=str(e))
            raise DatabaseError("delete", str(e))
    
    async def track_order(self, tracking_id: str) -> OrderTracking:
        """
        Track an order by tracking ID
        """
        try:
            # Find order by tracking ID
            response = self.client.table(self.table).select("*").eq("tracking_id", tracking_id).execute()
            
            if not response.data:
                raise NotFoundError("Order", tracking_id)
            
            order_data = response.data[0]
            
            # Get status history
            history_response = self.client.table("order_status_history").select("*").eq("order_id", order_data["id"]).order("created_at", desc=False).execute()
            status_history = history_response.data or []
            
            return OrderTracking(
                order_id=order_data["id"],
                tracking_id=tracking_id,
                status=order_data["status"],
                status_history=status_history,
                estimated_completion=order_data["estimated_completion"],
                current_location=self._get_current_location(order_data["status"]),
                last_updated=order_data["updated_at"]
            )
            
        except NotFoundError:
            raise
        except Exception as e:
            logger.error("Failed to track order", tracking_id=tracking_id, error=str(e))
            raise DatabaseError("track", str(e))
    
    def _get_current_location(self, status: RepairStatus) -> Optional[str]:
        """
        Get current location based on order status
        """
        location_map = {
            RepairStatus.RECEIVED: "Reception",
            RepairStatus.DIAGNOSTIC: "Diagnostic Lab",
            RepairStatus.WAITING: "Waiting Area",
            RepairStatus.IN_REPAIR: "Repair Workshop",
            RepairStatus.READY: "Quality Control",
            RepairStatus.DELIVERED: "Delivered",
            RepairStatus.CANCELLED: "Cancelled"
        }
        
        return location_map.get(status)


# Global order service instance (lazy initialization)
order_service = None

def get_order_service():
    """Get order service instance with lazy initialization"""
    global order_service
    if order_service is None:
        order_service = OrderService()
    return order_service


