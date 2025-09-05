"""
Order service for managing repair orders
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import structlog
import uuid

from app.core.firebase import get_firestore_client
from app.core.exceptions import NotFoundError, ValidationError, DatabaseError
from app.models.order import (
    OrderCreate, OrderUpdate, OrderResponse, OrderListResponse,
    OrderSearchParams, RepairStatus, OrderTracking
)

logger = structlog.get_logger()


class OrderService:
    """Service for managing repair orders"""
    
    def __init__(self):
        self.db = get_firestore_client()
        self.collection = "orders"
    
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
                "estimated_completion": estimated_completion,
                "notes": order_data.notes,
                "customer_address": order_data.customer_address.dict() if order_data.customer_address else None,
                "tracking_id": tracking_id,
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
                "status_history": [{
                    "status": RepairStatus.RECEIVED,
                    "timestamp": datetime.now(),
                    "notes": "Order received"
                }]
            }
            
            # Save to Firestore
            self.db.collection(self.collection).document(order_id).set(order_doc)
            
            # Get customer data
            customer_doc = self.db.collection("users").document(user_id).get()
            customer_data = customer_doc.to_dict() if customer_doc.exists else {}
            
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
            order_doc = self.db.collection(self.collection).document(order_id).get()
            
            if not order_doc.exists:
                raise NotFoundError("Order", order_id)
            
            order_data = order_doc.to_dict()
            
            # Check if user has access to this order
            if order_data["customer_id"] != user_id:
                raise ValidationError("Access denied to this order")
            
            # Get customer data
            customer_doc = self.db.collection("users").document(user_id).get()
            customer_data = customer_doc.to_dict() if customer_doc.exists else {}
            
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
            query = self.db.collection(self.collection).where("customer_id", "==", user_id)
            
            # Apply filters
            if search_params.status:
                query = query.where("status", "==", search_params.status)
            
            if search_params.phone_model:
                query = query.where("phone_model", "==", search_params.phone_model)
            
            if search_params.date_from:
                query = query.where("created_at", ">=", search_params.date_from)
            
            if search_params.date_to:
                query = query.where("created_at", "<=", search_params.date_to)
            
            # Apply sorting
            sort_field = search_params.sort_by
            if search_params.sort_order == "desc":
                query = query.order_by(sort_field, direction="DESCENDING")
            else:
                query = query.order_by(sort_field, direction="ASCENDING")
            
            # Apply pagination
            offset = (search_params.page - 1) * search_params.limit
            query = query.offset(offset).limit(search_params.limit)
            
            # Execute query
            docs = query.stream()
            
            orders = []
            for doc in docs:
                order_data = doc.to_dict()
                
                # Get customer data
                customer_doc = self.db.collection("users").document(user_id).get()
                customer_data = customer_doc.to_dict() if customer_doc.exists else {}
                
                orders.append(OrderResponse(**order_data, customer=customer_data))
            
            # Get total count (simplified - in production, use a separate counter)
            total_query = self.db.collection(self.collection).where("customer_id", "==", user_id)
            total_docs = total_query.stream()
            total = sum(1 for _ in total_docs)
            
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
            order_doc = self.db.collection(self.collection).document(order_id).get()
            
            if not order_doc.exists:
                raise NotFoundError("Order", order_id)
            
            order_data = order_doc.to_dict()
            
            # Check if user has access to this order
            if order_data["customer_id"] != user_id:
                raise ValidationError("Access denied to this order")
            
            # Prepare update data
            update_dict = {
                "updated_at": datetime.now()
            }
            
            if update_data.status:
                update_dict["status"] = update_data.status
                # Add to status history
                status_history = order_data.get("status_history", [])
                status_history.append({
                    "status": update_data.status,
                    "timestamp": datetime.now(),
                    "notes": update_data.notes or f"Status updated to {update_data.status}"
                })
                update_dict["status_history"] = status_history
            
            if update_data.notes:
                update_dict["notes"] = update_data.notes
            
            if update_data.estimated_completion:
                update_dict["estimated_completion"] = update_data.estimated_completion
            
            if update_data.services:
                update_dict["services"] = [service.dict() for service in update_data.services]
                # Recalculate total price
                total_price = sum(service.price for service in update_data.services)
                update_dict["total_price"] = total_price
            
            # Update document
            self.db.collection(self.collection).document(order_id).update(update_dict)
            
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
            order_doc = self.db.collection(self.collection).document(order_id).get()
            
            if not order_doc.exists:
                raise NotFoundError("Order", order_id)
            
            order_data = order_doc.to_dict()
            
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
            query = self.db.collection(self.collection).where("tracking_id", "==", tracking_id)
            docs = query.stream()
            
            order_doc = None
            for doc in docs:
                order_doc = doc
                break
            
            if not order_doc:
                raise NotFoundError("Order", tracking_id)
            
            order_data = order_doc.to_dict()
            
            return OrderTracking(
                order_id=order_data["id"],
                tracking_id=tracking_id,
                status=order_data["status"],
                status_history=order_data.get("status_history", []),
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


# Global order service instance
order_service = OrderService()


