"""
Quote service for managing repair quotes
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import structlog
import uuid

from app.core.firebase import get_firestore_client
from app.core.exceptions import NotFoundError, ValidationError, DatabaseError
from app.models.quote import (
    QuoteRequest, QuoteResponse, QuoteListResponse, QuoteUpdate,
    QuoteSearchParams, QuoteStatus, QuoteCalculation
)
from app.models.order import RepairService, ServiceCategory

logger = structlog.get_logger()


class QuoteService:
    """Service for managing repair quotes"""
    
    def __init__(self):
        self.db = get_firestore_client()
        self.collection = "quotes"
        self.services_collection = "services"
    
    async def create_quote(self, quote_request: QuoteRequest, user_id: str) -> QuoteResponse:
        """
        Create a new repair quote
        """
        try:
            logger.info("Creating new quote", user_id=user_id, phone_model=quote_request.phone_model)
            
            # Get services from database
            services = await self._get_services_by_ids(quote_request.services)
            
            if not services:
                raise ValidationError("No valid services found")
            
            # Calculate quote
            quote_calculation = await self._calculate_quote(
                quote_request.phone_model,
                services,
                quote_request.symptoms
            )
            
            # Generate quote ID
            quote_id = str(uuid.uuid4())
            
            # Set quote validity (7 days)
            valid_until = datetime.now() + timedelta(days=7)
            
            # Prepare quote document
            quote_doc = {
                "id": quote_id,
                "customer_id": user_id,
                "phone_model": quote_request.phone_model,
                "services": [service.dict() for service in services],
                "total_price": quote_calculation.total_price,
                "estimated_time": quote_calculation.estimated_time,
                "warranty": quote_calculation.warranty,
                "status": QuoteStatus.CALCULATED,
                "breakdown": quote_calculation.breakdown,
                "symptoms": quote_request.symptoms or [],
                "additional_info": quote_request.additional_info,
                "valid_until": valid_until,
                "created_at": datetime.now(),
                "updated_at": datetime.now()
            }
            
            # Save to Firestore
            self.db.collection(self.collection).document(quote_id).set(quote_doc)
            
            logger.info("Quote created successfully", quote_id=quote_id)
            
            return QuoteResponse(**quote_doc)
            
        except ValidationError:
            raise
        except Exception as e:
            logger.error("Failed to create quote", error=str(e))
            raise DatabaseError("create", str(e))
    
    async def get_quote(self, quote_id: str, user_id: str) -> QuoteResponse:
        """
        Get a specific quote by ID
        """
        try:
            quote_doc = self.db.collection(self.collection).document(quote_id).get()
            
            if not quote_doc.exists:
                raise NotFoundError("Quote", quote_id)
            
            quote_data = quote_doc.to_dict()
            
            # Check if user has access to this quote
            if quote_data["customer_id"] != user_id:
                raise ValidationError("Access denied to this quote")
            
            return QuoteResponse(**quote_data)
            
        except NotFoundError:
            raise
        except ValidationError:
            raise
        except Exception as e:
            logger.error("Failed to get quote", quote_id=quote_id, error=str(e))
            raise DatabaseError("get", str(e))
    
    async def get_quotes(
        self, 
        user_id: str, 
        search_params: QuoteSearchParams
    ) -> QuoteListResponse:
        """
        Get quotes with pagination and filtering
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
            
            quotes = []
            for doc in docs:
                quote_data = doc.to_dict()
                quotes.append(QuoteResponse(**quote_data))
            
            # Get total count
            total_query = self.db.collection(self.collection).where("customer_id", "==", user_id)
            total_docs = total_query.stream()
            total = sum(1 for _ in total_docs)
            
            has_next = (search_params.page * search_params.limit) < total
            has_prev = search_params.page > 1
            
            return QuoteListResponse(
                quotes=quotes,
                total=total,
                page=search_params.page,
                limit=search_params.limit,
                has_next=has_next,
                has_prev=has_prev
            )
            
        except Exception as e:
            logger.error("Failed to get quotes", user_id=user_id, error=str(e))
            raise DatabaseError("list", str(e))
    
    async def update_quote(
        self, 
        quote_id: str, 
        update_data: QuoteUpdate, 
        user_id: str
    ) -> QuoteResponse:
        """
        Update a quote
        """
        try:
            # Get existing quote
            quote_doc = self.db.collection(self.collection).document(quote_id).get()
            
            if not quote_doc.exists:
                raise NotFoundError("Quote", quote_id)
            
            quote_data = quote_doc.to_dict()
            
            # Check if user has access to this quote
            if quote_data["customer_id"] != user_id:
                raise ValidationError("Access denied to this quote")
            
            # Prepare update data
            update_dict = {
                "updated_at": datetime.now()
            }
            
            if update_data.status:
                update_dict["status"] = update_data.status
            
            if update_data.notes:
                update_dict["notes"] = update_data.notes
            
            # Update document
            self.db.collection(self.collection).document(quote_id).update(update_dict)
            
            # Get updated quote
            updated_quote = await self.get_quote(quote_id, user_id)
            
            logger.info("Quote updated successfully", quote_id=quote_id)
            
            return updated_quote
            
        except NotFoundError:
            raise
        except ValidationError:
            raise
        except Exception as e:
            logger.error("Failed to update quote", quote_id=quote_id, error=str(e))
            raise DatabaseError("update", str(e))
    
    async def accept_quote(self, quote_id: str, user_id: str) -> QuoteResponse:
        """
        Accept a quote (convert to order)
        """
        try:
            # Get quote
            quote = await self.get_quote(quote_id, user_id)
            
            # Check if quote is still valid
            if quote.valid_until < datetime.now():
                raise ValidationError("Quote has expired")
            
            if quote.status != QuoteStatus.CALCULATED:
                raise ValidationError("Quote cannot be accepted in current status")
            
            # Update quote status
            update_data = QuoteUpdate(status=QuoteStatus.ACCEPTED)
            updated_quote = await self.update_quote(quote_id, update_data, user_id)
            
            logger.info("Quote accepted successfully", quote_id=quote_id)
            
            return updated_quote
            
        except ValidationError:
            raise
        except Exception as e:
            logger.error("Failed to accept quote", quote_id=quote_id, error=str(e))
            raise DatabaseError("accept", str(e))
    
    async def reject_quote(self, quote_id: str, user_id: str) -> QuoteResponse:
        """
        Reject a quote
        """
        try:
            # Update quote status
            update_data = QuoteUpdate(status=QuoteStatus.REJECTED)
            updated_quote = await self.update_quote(quote_id, update_data, user_id)
            
            logger.info("Quote rejected successfully", quote_id=quote_id)
            
            return updated_quote
            
        except Exception as e:
            logger.error("Failed to reject quote", quote_id=quote_id, error=str(e))
            raise DatabaseError("reject", str(e))
    
    async def _get_services_by_ids(self, service_ids: List[str]) -> List[RepairService]:
        """
        Get services by their IDs
        """
        services = []
        
        for service_id in service_ids:
            service_doc = self.db.collection(self.services_collection).document(service_id).get()
            
            if service_doc.exists:
                service_data = service_doc.to_dict()
                services.append(RepairService(**service_data))
        
        return services
    
    async def _calculate_quote(
        self, 
        phone_model: str, 
        services: List[RepairService],
        symptoms: Optional[List[str]] = None
    ) -> QuoteCalculation:
        """
        Calculate quote based on phone model and services
        """
        total_price = 0.0
        total_time = 0
        breakdown = []
        
        # Model complexity multipliers
        model_multipliers = {
            "iPhone 15": 1.2,
            "iPhone 14": 1.1,
            "iPhone 13": 1.0,
            "iPhone 12": 0.9,
            "iPhone 11": 0.8,
            "iPhone X": 0.7
        }
        
        # Get model multiplier
        model_multiplier = 1.0
        for model, multiplier in model_multipliers.items():
            if model in phone_model:
                model_multiplier = multiplier
                break
        
        # Calculate for each service
        for service in services:
            base_price = service.price
            final_price = base_price * model_multiplier
            
            # Adjust for symptoms complexity
            complexity_factor = 1.0
            if symptoms:
                if any("cassé" in symptom.lower() for symptom in symptoms):
                    complexity_factor = 1.1
                elif any("défaillant" in symptom.lower() for symptom in symptoms):
                    complexity_factor = 1.05
            
            final_price *= complexity_factor
            total_price += final_price
            total_time += service.estimated_time
            
            breakdown.append({
                "service_id": service.id,
                "service_name": service.name,
                "base_price": base_price,
                "model_multiplier": model_multiplier,
                "complexity_factor": complexity_factor,
                "final_price": final_price,
                "estimated_time": service.estimated_time
            })
        
        # Calculate warranty (base 3 months, increases with service count)
        warranty = min(3 + len(services), 12)
        
        return QuoteCalculation(
            phone_model=phone_model,
            services=services,
            total_price=round(total_price, 2),
            estimated_time=total_time,
            warranty=warranty,
            breakdown=breakdown
        )
    
    async def get_available_services(self) -> List[RepairService]:
        """
        Get all available repair services
        """
        try:
            query = self.db.collection(self.services_collection).where("is_available", "==", True)
            docs = query.stream()
            
            services = []
            for doc in docs:
                service_data = doc.to_dict()
                service_data["id"] = doc.id
                services.append(RepairService(**service_data))
            
            return services
            
        except Exception as e:
            logger.error("Failed to get available services", error=str(e))
            raise DatabaseError("list_services", str(e))


# Global quote service instance
quote_service = QuoteService()


