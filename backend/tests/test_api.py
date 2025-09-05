"""
API endpoint tests
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, Mock


class TestHealthEndpoint:
    """Test health check endpoint"""
    
    def test_health_check(self, client: TestClient):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "iRepair Pro API"


class TestOrdersAPI:
    """Test orders API endpoints"""
    
    def test_create_order_success(self, client: TestClient, mock_firebase, auth_headers):
        """Test successful order creation"""
        with patch('app.services.order_service.order_service.create_order') as mock_create:
            mock_create.return_value = Mock(
                id="order-123",
                customer_id="test-user-123",
                phone_model="iPhone 13 Pro",
                total_price=1490.0,
                tracking_id="IRP20241201ABCD1234"
            )
            
            order_data = {
                "phone_model": "iPhone 13 Pro",
                "services": [
                    {
                        "id": "screen-replacement",
                        "name": "Remplacement d'écran",
                        "price": 1490.0,
                        "estimated_time": 2,
                        "category": "screen",
                        "is_available": True
                    }
                ],
                "customer_id": "test-user-123"
            }
            
            response = client.post("/api/v1/orders/", json=order_data, headers=auth_headers)
            assert response.status_code == 201
            data = response.json()
            assert data["id"] == "order-123"
            assert data["phone_model"] == "iPhone 13 Pro"
    
    def test_get_orders_success(self, client: TestClient, mock_firebase, auth_headers):
        """Test successful orders retrieval"""
        with patch('app.services.order_service.order_service.get_orders') as mock_get:
            mock_get.return_value = Mock(
                orders=[Mock(id="order-123", customer_id="test-user-123")],
                total=1,
                page=1,
                limit=20,
                has_next=False,
                has_prev=False
            )
            
            response = client.get("/api/v1/orders/", headers=auth_headers)
            assert response.status_code == 200
            data = response.json()
            assert len(data["orders"]) == 1
    
    def test_get_order_not_found(self, client: TestClient, mock_firebase, auth_headers):
        """Test order not found"""
        with patch('app.services.order_service.order_service.get_order') as mock_get:
            from app.core.exceptions import NotFoundError
            mock_get.side_effect = NotFoundError("Order", "non-existent")
            
            response = client.get("/api/v1/orders/non-existent", headers=auth_headers)
            assert response.status_code == 404
    
    def test_track_order_success(self, client: TestClient, mock_firebase):
        """Test order tracking"""
        with patch('app.services.order_service.order_service.track_order') as mock_track:
            mock_track.return_value = Mock(
                order_id="order-123",
                tracking_id="IRP20241201ABCD1234",
                status="en_reparation",
                current_location="Repair Workshop"
            )
            
            response = client.get("/api/v1/orders/tracking/IRP20241201ABCD1234")
            assert response.status_code == 200
            data = response.json()
            assert data["tracking_id"] == "IRP20241201ABCD1234"


class TestQuotesAPI:
    """Test quotes API endpoints"""
    
    def test_create_quote_success(self, client: TestClient, mock_firebase, auth_headers):
        """Test successful quote creation"""
        with patch('app.services.quote_service.quote_service.create_quote') as mock_create:
            mock_create.return_value = Mock(
                id="quote-123",
                customer_id="test-user-123",
                phone_model="iPhone 13 Pro",
                total_price=1490.0,
                status="calculated"
            )
            
            quote_data = {
                "phone_model": "iPhone 13 Pro",
                "services": ["screen-replacement"],
                "symptoms": ["Écran cassé"]
            }
            
            response = client.post("/api/v1/quotes/", json=quote_data, headers=auth_headers)
            assert response.status_code == 201
            data = response.json()
            assert data["id"] == "quote-123"
            assert data["phone_model"] == "iPhone 13 Pro"
    
    def test_calculate_quote_success(self, client: TestClient, mock_firebase, auth_headers):
        """Test quote calculation"""
        with patch('app.services.quote_service.quote_service.create_quote') as mock_create:
            mock_create.return_value = Mock(
                id="quote-123",
                total_price=1490.0,
                estimated_time=2,
                warranty=12
            )
            
            quote_data = {
                "phone_model": "iPhone 13 Pro",
                "services": ["screen-replacement"]
            }
            
            response = client.post("/api/v1/quotes/calculate", json=quote_data, headers=auth_headers)
            assert response.status_code == 200
            data = response.json()
            assert data["total_price"] == 1490.0
    
    def test_accept_quote_success(self, client: TestClient, mock_firebase, auth_headers):
        """Test quote acceptance"""
        with patch('app.services.quote_service.quote_service.accept_quote') as mock_accept:
            mock_accept.return_value = Mock(
                id="quote-123",
                status="accepted"
            )
            
            acceptance_data = {
                "quote_id": "quote-123",
                "customer_notes": "Accepté"
            }
            
            response = client.post("/api/v1/quotes/quote-123/accept", json=acceptance_data, headers=auth_headers)
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "accepted"


class TestUsersAPI:
    """Test users API endpoints"""
    
    def test_get_user_profile_success(self, client: TestClient, mock_firebase, auth_headers):
        """Test successful user profile retrieval"""
        with patch('app.services.user_service.user_service.get_user_profile') as mock_get:
            mock_get.return_value = Mock(
                uid="test-user-123",
                email="test@example.com",
                name="Test User",
                role="customer",
                total_orders=5,
                total_spent=7450.0
            )
            
            response = client.get("/api/v1/users/profile", headers=auth_headers)
            assert response.status_code == 200
            data = response.json()
            assert data["uid"] == "test-user-123"
            assert data["email"] == "test@example.com"
    
    def test_update_user_profile_success(self, client: TestClient, mock_firebase, auth_headers):
        """Test successful user profile update"""
        with patch('app.services.user_service.user_service.update_user_profile') as mock_update:
            mock_update.return_value = Mock(
                uid="test-user-123",
                name="Updated Name",
                phone="+212 6 98 76 54 32"
            )
            
            update_data = {
                "name": "Updated Name",
                "phone": "+212 6 98 76 54 32"
            }
            
            response = client.put("/api/v1/users/profile", json=update_data, headers=auth_headers)
            assert response.status_code == 200
            data = response.json()
            assert data["name"] == "Updated Name"


class TestChatbotAPI:
    """Test chatbot API endpoints"""
    
    def test_chat_success(self, client: TestClient, mock_firebase, auth_headers, mock_rag_service):
        """Test successful chat interaction"""
        chat_data = {
            "message": "Combien coûte une réparation d'écran?",
            "session_id": "session-123"
        }
        
        response = client.post("/api/v1/chatbot/query", json=chat_data, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert data["session_id"] == "session-123"
        assert "sources" in data
    
    def test_rag_query_success(self, client: TestClient, mock_firebase, auth_headers, mock_rag_service):
        """Test direct RAG query"""
        rag_data = {
            "question": "Quelle est la garantie?",
            "limit": 5,
            "threshold": 0.7
        }
        
        response = client.post("/api/v1/chatbot/rag/query", json=rag_data, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "answer" in data
        assert "sources" in data
        assert "confidence" in data
    
    def test_search_knowledge_success(self, client: TestClient, mock_firebase, auth_headers):
        """Test knowledge base search"""
        with patch('app.services.rag_service.rag_service.search_similar') as mock_search:
            mock_search.return_value = [
                {
                    "content": "Garantie 12 mois",
                    "metadata": {"source": "warranty"},
                    "score": 0.9
                }
            ]
            
            response = client.get("/api/v1/chatbot/knowledge/search?query=garantie", headers=auth_headers)
            assert response.status_code == 200
            data = response.json()
            assert "results" in data
            assert len(data["results"]) == 1


class TestAuthentication:
    """Test authentication and authorization"""
    
    def test_protected_endpoint_without_auth(self, client: TestClient):
        """Test accessing protected endpoint without authentication"""
        response = client.get("/api/v1/users/profile")
        assert response.status_code == 401
    
    def test_protected_endpoint_with_invalid_token(self, client: TestClient):
        """Test accessing protected endpoint with invalid token"""
        headers = {"Authorization": "Bearer invalid-token"}
        response = client.get("/api/v1/users/profile", headers=headers)
        assert response.status_code == 401
    
    def test_admin_endpoint_without_admin_role(self, client: TestClient, mock_firebase, auth_headers):
        """Test accessing admin endpoint without admin role"""
        with patch('app.core.security.get_current_user') as mock_auth:
            mock_auth.return_value = {"uid": "test-user-123", "role": "customer"}
            
            response = client.get("/api/v1/users/search?query=test", headers=auth_headers)
            assert response.status_code == 403


