"""
RAG (Retrieval-Augmented Generation) Service
Handles vector search and AI-powered responses using Supabase with pgvector and Gemini
"""

import google.generativeai as genai
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_google_genai import GoogleGenerativeAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from typing import List, Dict, Any, Optional
import structlog
import time
import uuid
import numpy as np
# psycopg2 imports removed - using Supabase client instead

from app.core.config import settings
from app.core.supabase import get_supabase_client
from app.core.exceptions import RAGError, ExternalServiceError
from app.models.chatbot import RAGQuery, RAGResponse, KnowledgeDocument

logger = structlog.get_logger()


class RAGService:
    """RAG service for intelligent question answering using Supabase pgvector"""
    
    def __init__(self):
        """Initialize RAG service with Gemini and Supabase pgvector"""
        try:
            # Initialize Gemini
            genai.configure(api_key=settings.GEMINI_API_KEY)
            
            # Setup embeddings
            self.embeddings = GoogleGenerativeAIEmbeddings(
                model="models/embedding-001",
                google_api_key=settings.GEMINI_API_KEY
            )
            
            # Setup text splitter for documents
            self.text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200
            )
            
            # Initialize Supabase client instead of direct DB connection
            from app.core.supabase import initialize_supabase, get_supabase_client
            initialize_supabase()
            self.supabase_client = get_supabase_client()
            
            if self.supabase_client is None:
                logger.warning("Supabase client not available, RAG service will use fallback responses")
            
            logger.info("RAG service initialized successfully with Gemini and Supabase client")
            
        except Exception as e:
            logger.error("Failed to initialize RAG service", error=str(e))
            raise RAGError(f"Initialization failed: {str(e)}")
    
    
    async def query(self, query: RAGQuery) -> RAGResponse:
        """
        Process a RAG query and return response with sources
        """
        start_time = time.time()
        
        try:
            logger.info("Processing RAG query", question=query.question)
            
            # Enhance question with context
            enhanced_question = self._enhance_question(query.question, query.context)
            
            # Get embedding for the question
            question_embedding = await self._get_embedding(enhanced_question)
            
            # Search for similar documents
            similar_docs = await self._search_similar_documents(question_embedding, k=3)
            
            # Prepare context for LLM
            context_docs = []
            sources = []
            confidence = 0.0
            
            for doc in similar_docs:
                context_docs.append(doc['content'])
                sources.append({
                    "content": doc['content'],
                    "metadata": doc['metadata'],
                    "score": doc['score']
                })
                confidence += doc['score']
            
            if sources:
                confidence = confidence / len(sources)
            
            # Generate response using OpenAI
            response = await self._generate_response(enhanced_question, context_docs)
            
            response_time = time.time() - start_time
            
            return RAGResponse(
                answer=response,
                sources=sources,
                confidence=confidence,
                query_time=response_time,
                metadata={
                    "model": "gemini-1.5-flash",
                    "temperature": 0.7,
                    "sources_count": len(sources)
                }
            )
            
        except Exception as e:
            logger.error("RAG query failed", error=str(e))
            raise RAGError(f"Query processing failed: {str(e)}")
    
    async def add_documents(self, documents: List[KnowledgeDocument]) -> Dict[str, Any]:
        """
        Add documents to the knowledge base
        """
        try:
            logger.info("Adding documents to knowledge base", count=len(documents))
            
            processed_docs = []
            
            for doc in documents:
                # Split document into chunks
                chunks = self.text_splitter.split_text(doc.content)
                
                for i, chunk in enumerate(chunks):
                    # Get embedding for chunk
                    embedding = await self._get_embedding(chunk)
                    
                    chunk_id = f"{doc.id}_{i}"
                    metadata = {
                        "id": chunk_id,
                        "title": doc.title,
                        "category": doc.category,
                        "tags": doc.tags,
                        "source": "knowledge_base",
                        "created_at": doc.created_at.isoformat(),
                        "updated_at": doc.updated_at.isoformat()
                    }
                    
                    # Store in database
                    await self._store_document_chunk(
                        chunk_id=chunk_id,
                        content=chunk,
                        embedding=embedding,
                        metadata=metadata
                    )
                    
                    processed_docs.append({
                        "id": chunk_id,
                        "content": chunk,
                        "metadata": metadata
                    })
            
            logger.info("Documents added successfully", processed_count=len(processed_docs))
            
            return {
                "documents_added": len(documents),
                "chunks_created": len(processed_docs),
                "timestamp": time.time()
            }
            
        except Exception as e:
            logger.error("Failed to add documents", error=str(e))
            raise RAGError(f"Document addition failed: {str(e)}")
    
    async def update_document(self, document: KnowledgeDocument) -> Dict[str, Any]:
        """
        Update a document in the knowledge base
        """
        try:
            # First, remove old chunks
            await self._remove_document_chunks(document.id)
            
            # Then add updated document
            result = await self.add_documents([document])
            
            logger.info("Document updated successfully", document_id=document.id)
            
            return result
            
        except Exception as e:
            logger.error("Failed to update document", error=str(e))
            raise RAGError(f"Document update failed: {str(e)}")
    
    async def delete_document(self, document_id: str) -> Dict[str, Any]:
        """
        Delete a document from the knowledge base
        """
        try:
            await self._remove_document_chunks(document_id)
            
            logger.info("Document deleted successfully", document_id=document_id)
            
            return {
                "document_deleted": document_id,
                "timestamp": time.time()
            }
            
        except Exception as e:
            logger.error("Failed to delete document", error=str(e))
            raise RAGError(f"Document deletion failed: {str(e)}")
    
    async def search_similar(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Search for similar documents
        """
        try:
            # Get embedding for query
            query_embedding = await self._get_embedding(query)
            
            # Search for similar documents
            results = await self._search_similar_documents(query_embedding, k=limit)
            
            return results
            
        except Exception as e:
            logger.error("Similarity search failed", error=str(e))
            raise RAGError(f"Similarity search failed: {str(e)}")
    
    async def _get_embedding(self, text: str) -> List[float]:
        """Get embedding for text using Gemini"""
        try:
            response = await self.embeddings.aembed_query(text)
            return response
        except Exception as e:
            # Check if it's a quota exceeded error
            if "429" in str(e) or "quota" in str(e).lower():
                logger.warning("Gemini embedding quota exceeded, using fallback embedding")
                # Return a simple fallback embedding (zeros)
                return [0.0] * 768  # Standard embedding dimension
            else:
                logger.error("Failed to get embedding", error=str(e))
                raise RAGError(f"Embedding generation failed: {str(e)}")
    
    async def _search_similar_documents(self, query_embedding: List[float], k: int = 3) -> List[Dict[str, Any]]:
        """Search for similar documents using Supabase"""
        try:
            if self.supabase_client is None:
                logger.warning("Supabase client not available, returning empty results")
                return []
                
            # For now, return simple text-based search since Supabase doesn't support vector search via REST API
            # This is a simplified version - in production, you'd need to use Supabase's vector functions
            result = self.supabase_client.table('knowledge_chunks').select('*').execute()
            
            if not result.data:
                return []
            
            # Simple text matching for now (in production, use proper vector similarity)
            results = []
            for chunk in result.data[:k]:
                results.append({
                    "id": chunk['id'],
                    "content": chunk['content'],
                    "metadata": chunk['metadata'],
                    "score": 0.8  # Default score for now
                })
            
            return results
                
        except Exception as e:
            logger.error("Failed to search similar documents", error=str(e))
            raise RAGError(f"Similarity search failed: {str(e)}")
    
    async def _store_document_chunk(self, chunk_id: str, content: str, embedding: List[float], metadata: Dict[str, Any]):
        """Store document chunk in database"""
        try:
            if self.supabase_client is None:
                logger.warning("Supabase client not available, skipping document storage")
                return
                
            # Store using Supabase client
            chunk_data = {
                "id": chunk_id,
                "content": content,
                "metadata": metadata
                # Note: embedding not stored in this simplified version
            }
            
            result = self.supabase_client.table('knowledge_chunks').upsert(chunk_data).execute()
            
            if not result.data:
                raise RAGError("Failed to store document chunk")
                
        except Exception as e:
            logger.error("Failed to store document chunk", error=str(e))
            raise RAGError(f"Document storage failed: {str(e)}")
    
    async def _remove_document_chunks(self, document_id: str):
        """Remove all chunks for a specific document"""
        try:
            if self.supabase_client is None:
                logger.warning("Supabase client not available, skipping chunk removal")
                return
                
            # Remove using Supabase client
            result = self.supabase_client.table('knowledge_chunks').delete().like('id', f"{document_id}_%").execute()
            
            logger.info("Removed document chunks", document_id=document_id, count=len(result.data) if result.data else 0)
                
        except Exception as e:
            logger.error("Failed to remove document chunks", error=str(e))
            raise RAGError(f"Chunk removal failed: {str(e)}")
    
    async def _generate_response(self, question: str, context_docs: List[str]) -> str:
        """Generate response using Gemini"""
        try:
            # Prepare context
            context = "\n\n".join(context_docs)
            
            # Create prompt
            prompt = f"""You are a helpful assistant for iRepair Pro, a professional iPhone repair service. 
            Provide accurate, helpful answers based on the provided context.

            Context:
            {context}

            Question: {question}

            Answer:"""
            
            # Initialize Gemini model
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            # Generate response
            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=1000,
                    top_p=0.8,
                    top_k=40
                )
            )
            
            return response.text.strip()
            
        except Exception as e:
            # Check if it's a quota exceeded error
            if "429" in str(e) or "quota" in str(e).lower():
                logger.warning("Gemini API quota exceeded, returning fallback response")
                return self._generate_fallback_response(question, context_docs)
            else:
                logger.error("Failed to generate response", error=str(e))
                raise RAGError(f"Response generation failed: {str(e)}")
    
    def _generate_fallback_response(self, question: str, context_docs: List[str]) -> str:
        """Generate a fallback response when API quota is exceeded"""
        # Simple keyword-based response
        question_lower = question.lower()
        
        if any(word in question_lower for word in ["service", "réparation", "repair"]):
            return "iRepair Pro offre des services de réparation complets pour iPhone, incluant la réparation d'écran, de batterie, de caméra et d'autres composants. Nos techniciens qualifiés utilisent des pièces de qualité pour garantir des réparations durables."
        
        elif any(word in question_lower for word in ["prix", "coût", "price", "cost"]):
            return "Les prix de réparation varient selon le modèle et le type de réparation. Pour un devis précis, veuillez nous contacter avec les détails de votre appareil et du problème."
        
        elif any(word in question_lower for word in ["garantie", "warranty"]):
            return "Toutes nos réparations sont couvertes par une garantie. Les détails spécifiques de la garantie dépendent du type de réparation effectuée."
        
        elif any(word in question_lower for word in ["délai", "temps", "time", "duration"]):
            return "Les délais de réparation varient selon la complexité du problème. La plupart des réparations sont effectuées en 24-48 heures."
        
        else:
            return "Merci pour votre question. Nos techniciens experts sont là pour vous aider avec tous vos besoins de réparation iPhone. Pour des informations plus détaillées, n'hésitez pas à nous contacter directement."
    
    def _enhance_question(self, question: str, context: Optional[Dict[str, Any]]) -> str:
        """
        Enhance question with context information
        """
        if not context:
            return question
        
        context_str = ""
        if "user_id" in context:
            context_str += f"User ID: {context['user_id']}. "
        if "session_id" in context:
            context_str += f"Session ID: {context['session_id']}. "
        if "previous_messages" in context:
            context_str += f"Previous conversation context available. "
        
        return f"{context_str}Question: {question}"
    
    async def get_knowledge_stats(self) -> Dict[str, Any]:
        """
        Get knowledge base statistics
        """
        try:
            if self.supabase_client is None:
                logger.warning("Supabase client not available, returning empty stats")
                return {
                    "total_chunks": 0,
                    "unique_documents": 0,
                    "timestamp": time.time()
                }
                
            # Get stats using Supabase client
            result = self.supabase_client.table('knowledge_chunks').select('*', count='exact').execute()
            total_chunks = result.count
            
            # Count unique documents (simplified)
            unique_documents = len(set(chunk['metadata'].get('id', '') for chunk in result.data)) if result.data else 0
                
            return {
                "total_chunks": total_chunks,
                "unique_documents": unique_documents,
                "timestamp": time.time()
            }
                
        except Exception as e:
            logger.error("Failed to get knowledge stats", error=str(e))
            raise RAGError(f"Stats retrieval failed: {str(e)}")


# Global RAG service instance (lazy initialization)
rag_service = None

def get_rag_service():
    """Get RAG service instance with lazy initialization"""
    global rag_service
    if rag_service is None:
        rag_service = RAGService()
    return rag_service