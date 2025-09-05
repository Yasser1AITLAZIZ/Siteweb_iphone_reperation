"""
RAG (Retrieval-Augmented Generation) Service
Handles vector search and AI-powered responses
"""

import openai
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
import pinecone
from typing import List, Dict, Any, Optional
import structlog
import time
import uuid

from app.core.config import settings
from app.core.exceptions import RAGError, ExternalServiceError
from app.models.chatbot import RAGQuery, RAGResponse, KnowledgeDocument

logger = structlog.get_logger()


class RAGService:
    """RAG service for intelligent question answering"""
    
    def __init__(self):
        """Initialize RAG service with OpenAI and Pinecone"""
        try:
            # Initialize OpenAI
            openai.api_key = settings.OPENAI_API_KEY
            
            # Initialize Pinecone
            pinecone.init(
                api_key=settings.PINECONE_API_KEY,
                environment=settings.PINECONE_ENVIRONMENT
            )
            
            # Setup embeddings
            self.embeddings = OpenAIEmbeddings(
                openai_api_key=settings.OPENAI_API_KEY
            )
            
            # Get or create Pinecone index
            if settings.PINECONE_INDEX_NAME not in pinecone.list_indexes():
                pinecone.create_index(
                    name=settings.PINECONE_INDEX_NAME,
                    dimension=1536,  # OpenAI embedding dimension
                    metric="cosine"
                )
            
            self.index = pinecone.Index(settings.PINECONE_INDEX_NAME)
            
            # Setup vector store
            self.vectorstore = Pinecone(
                self.index,
                self.embeddings.embed_query,
                "text"
            )
            
            # Setup QA chain
            self.qa_chain = RetrievalQA.from_chain_type(
                llm=OpenAI(
                    openai_api_key=settings.OPENAI_API_KEY,
                    temperature=0.7,
                    max_tokens=1000
                ),
                chain_type="stuff",
                retriever=self.vectorstore.as_retriever(
                    search_kwargs={"k": 3}
                ),
                return_source_documents=True
            )
            
            # Text splitter for documents
            self.text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200
            )
            
            logger.info("RAG service initialized successfully")
            
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
            
            # Get response from QA chain
            result = self.qa_chain({"query": enhanced_question})
            
            # Extract sources and calculate confidence
            sources = []
            confidence = 0.0
            
            if "source_documents" in result:
                for doc in result["source_documents"]:
                    sources.append({
                        "content": doc.page_content,
                        "metadata": doc.metadata,
                        "score": getattr(doc, 'score', 0.8)
                    })
                
                # Calculate confidence based on source scores
                if sources:
                    confidence = sum(source["score"] for source in sources) / len(sources)
            
            response_time = time.time() - start_time
            
            return RAGResponse(
                answer=result["result"],
                sources=sources,
                confidence=confidence,
                query_time=response_time,
                metadata={
                    "model": "gpt-4",
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
                    processed_doc = Document(
                        page_content=chunk,
                        metadata={
                            "id": f"{doc.id}_{i}",
                            "title": doc.title,
                            "category": doc.category,
                            "tags": doc.tags,
                            "source": "knowledge_base",
                            "created_at": doc.created_at.isoformat(),
                            "updated_at": doc.updated_at.isoformat()
                        }
                    )
                    processed_docs.append(processed_doc)
            
            # Add to vector store
            self.vectorstore.add_documents(processed_docs)
            
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
            # Perform similarity search
            docs = self.vectorstore.similarity_search_with_score(query, k=limit)
            
            results = []
            for doc, score in docs:
                results.append({
                    "content": doc.page_content,
                    "metadata": doc.metadata,
                    "score": score
                })
            
            return results
            
        except Exception as e:
            logger.error("Similarity search failed", error=str(e))
            raise RAGError(f"Similarity search failed: {str(e)}")
    
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
    
    async def _remove_document_chunks(self, document_id: str):
        """
        Remove all chunks for a specific document
        """
        try:
            # Query for chunks with this document ID
            query_response = self.index.query(
                vector=[0] * 1536,  # Dummy vector
                filter={"metadata.id": {"$regex": f"^{document_id}_"}},
                top_k=1000,
                include_metadata=True
            )
            
            # Extract IDs to delete
            ids_to_delete = []
            for match in query_response.matches:
                if match.metadata.get("id", "").startswith(f"{document_id}_"):
                    ids_to_delete.append(match.id)
            
            # Delete chunks
            if ids_to_delete:
                self.index.delete(ids=ids_to_delete)
                logger.info("Removed document chunks", document_id=document_id, count=len(ids_to_delete))
            
        except Exception as e:
            logger.error("Failed to remove document chunks", error=str(e))
            raise RAGError(f"Chunk removal failed: {str(e)}")
    
    async def get_knowledge_stats(self) -> Dict[str, Any]:
        """
        Get knowledge base statistics
        """
        try:
            stats = self.index.describe_index_stats()
            
            return {
                "total_vectors": stats.total_vector_count,
                "dimension": stats.dimension,
                "index_fullness": stats.index_fullness,
                "timestamp": time.time()
            }
            
        except Exception as e:
            logger.error("Failed to get knowledge stats", error=str(e))
            raise RAGError(f"Stats retrieval failed: {str(e)}")


# Global RAG service instance
rag_service = RAGService()


