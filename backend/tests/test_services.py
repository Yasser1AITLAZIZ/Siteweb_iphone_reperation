"""
Service layer tests
"""

import pytest
from unittest.mock import Mock, patch, AsyncMock
from datetime import datetime

from app.services.order_service import OrderService
from app.services.quote_service import QuoteService
from app.services.user_service import UserService
from app.services.rag_service import RAGService
from app.core.exceptions import NotFoundError, ValidationError, DatabaseError


class TestOrderService:
    """Test OrderService"""
    
    @pytest.fixture
    def order_service(self):
        """Create OrderService instance with mocked dependencies"""
        with patch('app.services.order_service.get_firestore_client') as mock_db:
            service = OrderService()
            service.db = mock_db.return_value
            yield service
    
    @pytest.mark.asyncio
    async def test_create_order_success(self, order_service, mock_order):
        """Test successful order creation"""
        # Mock Firestore operations
        order_service.db.collection.return_value.document.return_value.set = Mock()
        
        # Mock user data
        with patch('app.services.order_service.get_firestore_client') as mock_db:
            mock_user_doc = Mock()
            mock_user_doc.exists = True
            mock_user_doc.to_dict.return_value = {"name": "Test User", "email": "test@example.com"}
            mock_db.return_value.collection.return_value.document.return_value.get.return_value = mock_user_doc
            
            from app.models.order import OrderCreate, RepairService, ServiceCategory
            
            order_data = OrderCreate(
                phone_model="iPhone 13 Pro",
                services=[
                    RepairService(
                        id="screen-replacement",
                        name="Remplacement d'écran",
                        description="Écran complet",
                        price=1490.0,
                        estimated_time=2,
                        category=ServiceCategory.SCREEN,
                        is_available=True
                    )
                ],
                customer_id="test-user-123"
            )
            
            result = await order_service.create_order(order_data, "test-user-123")
            
            assert result.phone_model == "iPhone 13 Pro"
            assert result.total_price == 1490.0
            assert result.tracking_id.startswith("IRP")
    
    @pytest.mark.asyncio
    async def test_get_order_not_found(self, order_service):
        """Test getting non-existent order"""
        # Mock Firestore to return non-existent document
        mock_doc = Mock()
        mock_doc.exists = False
        order_service.db.collection.return_value.document.return_value.get.return_value = mock_doc
        
        with pytest.raises(NotFoundError):
            await order_service.get_order("non-existent", "test-user-123")
    
    @pytest.mark.asyncio
    async def test_update_order_success(self, order_service, mock_order):
        """Test successful order update"""
        # Mock existing order
        mock_doc = Mock()
        mock_doc.exists = True
        mock_doc.to_dict.return_value = {
            "id": "order-123",
            "customer_id": "test-user-123",
            "status": "recu",
            "status_history": []
        }
        order_service.db.collection.return_value.document.return_value.get.return_value = mock_doc
        order_service.db.collection.return_value.document.return_value.update = Mock()
        
        from app.models.order import OrderUpdate, RepairStatus
        
        update_data = OrderUpdate(
            status=RepairStatus.IN_REPAIR,
            notes="En cours de réparation"
        )
        
        with patch.object(order_service, 'get_order') as mock_get:
            mock_get.return_value = Mock(
                id="order-123",
                customer_id="test-user-123",
                status=RepairStatus.IN_REPAIR
            )
            
            result = await order_service.update_order("order-123", update_data, "test-user-123")
            assert result.status == RepairStatus.IN_REPAIR


class TestQuoteService:
    """Test QuoteService"""
    
    @pytest.fixture
    def quote_service(self):
        """Create QuoteService instance with mocked dependencies"""
        with patch('app.services.quote_service.get_firestore_client') as mock_db:
            service = QuoteService()
            service.db = mock_db.return_value
            yield service
    
    @pytest.mark.asyncio
    async def test_create_quote_success(self, quote_service):
        """Test successful quote creation"""
        # Mock services collection
        mock_service_doc = Mock()
        mock_service_doc.exists = True
        mock_service_doc.to_dict.return_value = {
            "id": "screen-replacement",
            "name": "Remplacement d'écran",
            "description": "Écran complet",
            "price": 1490.0,
            "estimated_time": 2,
            "category": "screen",
            "is_available": True
        }
        
        quote_service.db.collection.return_value.document.return_value.get.return_value = mock_service_doc
        quote_service.db.collection.return_value.document.return_value.set = Mock()
        
        from app.models.quote import QuoteRequest
        
        quote_request = QuoteRequest(
            phone_model="iPhone 13 Pro",
            services=["screen-replacement"],
            symptoms=["Écran cassé"]
        )
        
        result = await quote_service.create_quote(quote_request, "test-user-123")
        
        assert result.phone_model == "iPhone 13 Pro"
        assert result.total_price > 0
        assert result.status == "calculated"
    
    @pytest.mark.asyncio
    async def test_calculate_quote_with_model_multiplier(self, quote_service):
        """Test quote calculation with model multiplier"""
        # Mock service
        mock_service_doc = Mock()
        mock_service_doc.exists = True
        mock_service_doc.to_dict.return_value = {
            "id": "screen-replacement",
            "name": "Remplacement d'écran",
            "price": 1000.0,
            "estimated_time": 2,
            "category": "screen",
            "is_available": True
        }
        
        quote_service.db.collection.return_value.document.return_value.get.return_value = mock_service_doc
        
        # Test iPhone 15 (should have higher multiplier)
        result = await quote_service._calculate_quote(
            "iPhone 15 Pro",
            [Mock(price=1000.0, estimated_time=2)],
            []
        )
        
        assert result.total_price > 1000.0  # Should be multiplied
        assert result.phone_model == "iPhone 15 Pro"


class TestUserService:
    """Test UserService"""
    
    @pytest.fixture
    def user_service(self):
        """Create UserService instance with mocked dependencies"""
        with patch('app.services.user_service.get_firestore_client') as mock_db:
            service = UserService()
            service.db = mock_db.return_value
            yield service
    
    @pytest.mark.asyncio
    async def test_get_user_profile_success(self, user_service):
        """Test successful user profile retrieval"""
        # Mock user document
        mock_user_doc = Mock()
        mock_user_doc.exists = True
        mock_user_doc.to_dict.return_value = {
            "name": "Test User",
            "email": "test@example.com",
            "role": "customer",
            "status": "active"
        }
        
        user_service.db.collection.return_value.document.return_value.get.return_value = mock_user_doc
        
        # Mock orders collection for statistics
        mock_orders = [
            Mock(to_dict=lambda: {"total_price": 1490.0}),
            Mock(to_dict=lambda: {"total_price": 890.0})
        ]
        user_service.db.collection.return_value.where.return_value.stream.return_value = mock_orders
        
        result = await user_service.get_user_profile("test-user-123")
        
        assert result.uid == "test-user-123"
        assert result.name == "Test User"
        assert result.total_orders == 2
        assert result.total_spent == 2380.0
    
    @pytest.mark.asyncio
    async def test_update_user_profile_success(self, user_service):
        """Test successful user profile update"""
        # Mock existing user
        mock_doc = Mock()
        mock_doc.exists = True
        mock_doc.to_dict.return_value = {
            "uid": "test-user-123",
            "name": "Old Name",
            "email": "test@example.com"
        }
        
        user_service.db.collection.return_value.document.return_value.get.return_value = mock_doc
        user_service.db.collection.return_value.document.return_value.update = Mock()
        
        from app.models.user import UserUpdate
        
        update_data = UserUpdate(
            name="New Name",
            phone="+212 6 98 76 54 32"
        )
        
        with patch.object(user_service, 'get_user_profile') as mock_get:
            mock_get.return_value = Mock(
                uid="test-user-123",
                name="New Name",
                phone="+212 6 98 76 54 32"
            )
            
            result = await user_service.update_user_profile("test-user-123", update_data)
            assert result.name == "New Name"


class TestRAGService:
    """Test RAGService"""
    
    @pytest.fixture
    def rag_service(self):
        """Create RAGService instance with mocked dependencies"""
        with patch('app.services.rag_service.pinecone'), \
             patch('app.services.rag_service.OpenAIEmbeddings'), \
             patch('app.services.rag_service.OpenAI'), \
             patch('app.services.rag_service.Pinecone'):
            
            service = RAGService()
            service.vectorstore = Mock()
            service.qa_chain = Mock()
            yield service
    
    @pytest.mark.asyncio
    async def test_query_success(self, rag_service):
        """Test successful RAG query"""
        # Mock QA chain response
        rag_service.qa_chain.return_value = {
            "result": "Le prix d'une réparation d'écran est de 1490 DH.",
            "source_documents": [
                Mock(
                    page_content="Réparation d'écran: 1490 DH",
                    metadata={"source": "pricing"},
                    score=0.9
                )
            ]
        }
        
        from app.models.chatbot import RAGQuery
        
        query = RAGQuery(
            question="Combien coûte une réparation d'écran?",
            limit=5,
            threshold=0.7
        )
        
        result = await rag_service.query(query)
        
        assert "réparation d'écran" in result.answer
        assert len(result.sources) == 1
        assert result.confidence > 0.0
    
    @pytest.mark.asyncio
    async def test_add_documents_success(self, rag_service):
        """Test successful document addition"""
        # Mock text splitter
        rag_service.text_splitter.split_text.return_value = ["Chunk 1", "Chunk 2"]
        
        # Mock vector store
        rag_service.vectorstore.add_documents = Mock()
        
        from app.models.chatbot import KnowledgeDocument
        
        documents = [
            KnowledgeDocument(
                id="doc-1",
                title="Test Document",
                content="This is a test document content.",
                category="test",
                tags=["test"],
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
        ]
        
        result = await rag_service.add_documents(documents)
        
        assert result["documents_added"] == 1
        assert result["chunks_created"] == 2
        rag_service.vectorstore.add_documents.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_search_similar_success(self, rag_service):
        """Test successful similarity search"""
        # Mock similarity search
        rag_service.vectorstore.similarity_search_with_score.return_value = [
            (Mock(page_content="Test content", metadata={"source": "test"}), 0.9)
        ]
        
        results = await rag_service.search_similar("test query", 5)
        
        assert len(results) == 1
        assert results[0]["score"] == 0.9
        assert "Test content" in results[0]["content"]


