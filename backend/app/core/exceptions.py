"""
Custom exceptions for the iRepair Pro API
"""

from typing import Any, Dict, Optional


class CustomException(Exception):
    """Base custom exception"""
    
    def __init__(
        self,
        message: str,
        status_code: int = 500,
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)


class ValidationError(CustomException):
    """Validation error exception"""
    
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message, 400, details)


class AuthenticationError(CustomException):
    """Authentication error exception"""
    
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message, 401)


class AuthorizationError(CustomException):
    """Authorization error exception"""
    
    def __init__(self, message: str = "Insufficient permissions"):
        super().__init__(message, 403)


class NotFoundError(CustomException):
    """Resource not found exception"""
    
    def __init__(self, resource: str, identifier: str):
        message = f"{resource} with identifier '{identifier}' not found"
        super().__init__(message, 404)


class ConflictError(CustomException):
    """Resource conflict exception"""
    
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message, 409, details)


class RateLimitError(CustomException):
    """Rate limit exceeded exception"""
    
    def __init__(self, message: str = "Rate limit exceeded"):
        super().__init__(message, 429)


class ExternalServiceError(CustomException):
    """External service error exception"""
    
    def __init__(self, service: str, message: str):
        full_message = f"External service '{service}' error: {message}"
        super().__init__(full_message, 502)


class DatabaseError(CustomException):
    """Database operation error exception"""
    
    def __init__(self, operation: str, message: str):
        full_message = f"Database {operation} error: {message}"
        super().__init__(full_message, 500)


class RAGError(CustomException):
    """RAG service error exception"""
    
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(f"RAG service error: {message}", 500, details)





