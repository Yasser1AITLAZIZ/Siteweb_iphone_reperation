"""
Test configuration and fixtures
"""

import pytest
import asyncio
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch
import os
import sys

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.core.config import settings


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def client():
    """Create a test client"""
    return TestClient(app)


@pytest.fixture
def mock_firebase():
    """Mock Firebase services"""
    with patch('app.core.firebase.get_firestore_client') as mock_db, \
         patch('app.core.firebase.get_auth_client') as mock_auth, \
         patch('app.core.firebase.verify_firebase_token') as mock_verify:
        
        # Mock Firestore
        mock_db.return_value = Mock()
        
        # Mock Auth
        mock_auth.return_value = Mock()
        
        # Mock token verification
        mock_verify.return_value = {
            "uid": "test-user-123",
            "email": "test@example.com",
            "email_verified": True,
            "name": "Test User"
        }
        
        yield {
            "db": mock_db.return_value,
            "auth": mock_auth.return_value,
            "verify": mock_verify
        }


@pytest.fixture
def mock_user():
    """Mock user data"""
    return {
        "uid": "test-user-123",
        "email": "test@example.com",
        "name": "Test User",
        "phone": "+212 6 12 34 56 78",
        "role": "customer",
        "status": "active"
    }


@pytest.fixture
def mock_order():
    """Mock order data"""
    return {
        "id": "order-123",
        "customer_id": "test-user-123",
        "phone_model": "iPhone 13 Pro",
        "services": [
            {
                "id": "screen-replacement",
                "name": "Remplacement d'écran",
                "price": 1490.0,
                "estimated_time": 2,
                "category": "screen"
            }
        ],
        "status": "recu",
        "total_price": 1490.0,
        "tracking_id": "IRP20241201ABCD1234"
    }


@pytest.fixture
def mock_quote():
    """Mock quote data"""
    return {
        "id": "quote-123",
        "customer_id": "test-user-123",
        "phone_model": "iPhone 13 Pro",
        "services": [
            {
                "id": "screen-replacement",
                "name": "Remplacement d'écran",
                "price": 1490.0,
                "estimated_time": 2,
                "category": "screen"
            }
        ],
        "total_price": 1490.0,
        "estimated_time": 2,
        "warranty": 12,
        "status": "calculated"
    }


@pytest.fixture
def auth_headers():
    """Mock authentication headers"""
    return {"Authorization": "Bearer mock-token-123"}


@pytest.fixture
def mock_rag_service():
    """Mock RAG service"""
    with patch('app.services.rag_service.rag_service') as mock_rag:
        mock_rag.query.return_value = {
            "answer": "Le prix d'une réparation d'écran est de 1490 DH.",
            "sources": [
                {
                    "content": "Réparation d'écran: 1490 DH",
                    "metadata": {"source": "pricing"},
                    "score": 0.9
                }
            ],
            "confidence": 0.9,
            "query_time": 0.5
        }
        yield mock_rag


