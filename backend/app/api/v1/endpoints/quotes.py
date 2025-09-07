"""
Quotes API endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import structlog

from app.core.security import get_current_user, require_customer
from app.core.exceptions import NotFoundError, ValidationError, DatabaseError
from app.models.quote import (
    QuoteRequest, QuoteResponse, QuoteListResponse, QuoteUpdate,
    QuoteSearchParams, QuoteAcceptance
)
from app.models.order import RepairService
from app.services.quote_service import get_quote_service

logger = structlog.get_logger()
router = APIRouter()


@router.post("/", response_model=QuoteResponse, status_code=status.HTTP_201_CREATED)
async def create_quote(
    quote_request: QuoteRequest,
    current_user: dict = Depends(require_customer)
):
    """
    Create a new repair quote
    """
    try:
        logger.info("Creating quote", user_id=current_user["uid"], phone_model=quote_request.phone_model)
        
        quote = await get_quote_service().create_quote(quote_request, current_user["uid"])
        
        logger.info("Quote created successfully", quote_id=quote.id)
        return quote
        
    except ValidationError as e:
        logger.warning("Quote creation validation failed", error=str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except DatabaseError as e:
        logger.error("Quote creation database error", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create quote")


@router.post("/calculate", response_model=QuoteResponse)
async def calculate_quote(
    quote_request: QuoteRequest,
    current_user: dict = Depends(require_customer)
):
    """
    Calculate a quote without saving it
    """
    try:
        logger.info("Calculating quote", user_id=current_user["uid"], phone_model=quote_request.phone_model)
        
        # Create and return quote (this will calculate but not save)
        quote = await get_quote_service().create_quote(quote_request, current_user["uid"])
        
        logger.info("Quote calculated successfully", quote_id=quote.id)
        return quote
        
    except ValidationError as e:
        logger.warning("Quote calculation validation failed", error=str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except DatabaseError as e:
        logger.error("Quote calculation database error", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to calculate quote")


@router.get("/", response_model=QuoteListResponse)
async def get_quotes(
    search_params: QuoteSearchParams = Depends(),
    current_user: dict = Depends(require_customer)
):
    """
    Get user's quotes with pagination and filtering
    """
    try:
        logger.info("Getting quotes", user_id=current_user["uid"], params=search_params.dict())
        
        quotes = await get_quote_service().get_quotes(current_user["uid"], search_params)
        
        return quotes
        
    except DatabaseError as e:
        logger.error("Failed to get quotes", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve quotes")


@router.get("/{quote_id}", response_model=QuoteResponse)
async def get_quote(
    quote_id: str,
    current_user: dict = Depends(require_customer)
):
    """
    Get a specific quote by ID
    """
    try:
        logger.info("Getting quote", quote_id=quote_id, user_id=current_user["uid"])
        
        quote = await get_quote_service().get_quote(quote_id, current_user["uid"])
        
        return quote
        
    except NotFoundError as e:
        logger.warning("Quote not found", quote_id=quote_id)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ValidationError as e:
        logger.warning("Quote access denied", quote_id=quote_id, error=str(e))
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except DatabaseError as e:
        logger.error("Failed to get quote", quote_id=quote_id, error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve quote")


@router.put("/{quote_id}", response_model=QuoteResponse)
async def update_quote(
    quote_id: str,
    update_data: QuoteUpdate,
    current_user: dict = Depends(require_customer)
):
    """
    Update a quote
    """
    try:
        logger.info("Updating quote", quote_id=quote_id, user_id=current_user["uid"])
        
        quote = await get_quote_service().update_quote(quote_id, update_data, current_user["uid"])
        
        logger.info("Quote updated successfully", quote_id=quote_id)
        return quote
        
    except NotFoundError as e:
        logger.warning("Quote not found for update", quote_id=quote_id)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ValidationError as e:
        logger.warning("Quote update validation failed", quote_id=quote_id, error=str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except DatabaseError as e:
        logger.error("Failed to update quote", quote_id=quote_id, error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update quote")


@router.post("/{quote_id}/accept", response_model=QuoteResponse)
async def accept_quote(
    quote_id: str,
    acceptance: QuoteAcceptance,
    current_user: dict = Depends(require_customer)
):
    """
    Accept a quote
    """
    try:
        logger.info("Accepting quote", quote_id=quote_id, user_id=current_user["uid"])
        
        quote = await get_quote_service().accept_quote(quote_id, current_user["uid"])
        
        logger.info("Quote accepted successfully", quote_id=quote_id)
        return quote
        
    except NotFoundError as e:
        logger.warning("Quote not found for acceptance", quote_id=quote_id)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ValidationError as e:
        logger.warning("Quote acceptance validation failed", quote_id=quote_id, error=str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except DatabaseError as e:
        logger.error("Failed to accept quote", quote_id=quote_id, error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to accept quote")


@router.post("/{quote_id}/reject", response_model=QuoteResponse)
async def reject_quote(
    quote_id: str,
    current_user: dict = Depends(require_customer)
):
    """
    Reject a quote
    """
    try:
        logger.info("Rejecting quote", quote_id=quote_id, user_id=current_user["uid"])
        
        quote = await get_quote_service().reject_quote(quote_id, current_user["uid"])
        
        logger.info("Quote rejected successfully", quote_id=quote_id)
        return quote
        
    except NotFoundError as e:
        logger.warning("Quote not found for rejection", quote_id=quote_id)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except ValidationError as e:
        logger.warning("Quote rejection validation failed", quote_id=quote_id, error=str(e))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except DatabaseError as e:
        logger.error("Failed to reject quote", quote_id=quote_id, error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to reject quote")


@router.get("/services/available", response_model=List[RepairService])
async def get_available_services():
    """
    Get all available repair services (public endpoint)
    """
    try:
        logger.info("Getting available services")
        
        services = await get_quote_service().get_available_services()
        
        return services
        
    except DatabaseError as e:
        logger.error("Failed to get available services", error=str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to retrieve services")


