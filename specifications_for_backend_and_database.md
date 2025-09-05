# Cursor AI Integration Specifications for Vibe Code Project

## Project Architecture Overview

```
Frontend: React 18 + TypeScript + Vite + Zustand + Tailwind CSS
Backend: FastAPI (Python)
Database: Firebase Firestore
Auth: Firebase Authentication
AI/Chat: RAG-powered Vector Database
Integration Tool: Cursor AI Agent
```

## Phase 1: Backend and API Integration 

### 1.1 FastAPI Service Architecture

```python
# Directory Structure
backend/
├── app/
│   ├── main.py
│   ├── api/
│   │   ├── v1/
│   │   │   ├── endpoints/
│   │   │   │   ├── orders.py
│   │   │   │   ├── quotes.py
│   │   │   │   ├── users.py
│   │   │   │   └── chatbot.py
│   │   │   └── api.py
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── firebase.py
│   ├── services/
│   │   ├── order_service.py
│   │   ├── quote_service.py
│   │   └── rag_service.py
│   └── models/
│       ├── order.py
│       ├── quote.py
│       └── user.py
```

### 1.2 API Endpoint Specifications

```python
# Orders API
POST   /api/v1/orders           # Create new order
GET    /api/v1/orders           # List all orders (with pagination)
GET    /api/v1/orders/{id}      # Get specific order
PUT    /api/v1/orders/{id}      # Update order
DELETE /api/v1/orders/{id}      # Delete order
GET    /api/v1/orders/tracking/{tracking_id}  # Track order

# Quotes API  
POST   /api/v1/quotes           # Create repair quote
GET    /api/v1/quotes           # List quotes
GET    /api/v1/quotes/{id}      # Get specific quote
PUT    /api/v1/quotes/{id}      # Update quote status
POST   /api/v1/quotes/calculate # Calculate quote price

# Users API
POST   /api/v1/users/register   # User registration
POST   /api/v1/users/login      # User login
GET    /api/v1/users/profile    # Get user profile
PUT    /api/v1/users/profile    # Update profile
```

### 1.3 Async Implementation Pattern

```python
# Example async endpoint implementation
from fastapi import APIRouter, HTTPException, Depends
from typing import List
import asyncio

router = APIRouter()

@router.get("/orders", response_model=List[OrderSchema])
async def get_orders(
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(get_current_user)
):
    try:
        # Async Firebase query
        orders = await order_service.get_user_orders(
            user_id=current_user.uid,
            skip=skip,
            limit=limit
        )
        return orders
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## Phase 2: Firebase Integration 

### 2.1 Frontend State Migration

```typescript
// Before: Zustand Store
interface StoreState {
  orders: Order[];
  user: User | null;
  cart: CartItem[];
}

// After: Firebase-connected Store
import { 
  collection, 
  onSnapshot, 
  query, 
  where 
} from 'firebase/firestore';

const useFirebaseStore = create((set) => ({
  orders: [],
  user: null,
  cart: [],
  
  // Real-time listeners
  subscribeToOrders: (userId: string) => {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId)
    );
    
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      set({ orders });
    });
  },
  
  // Async actions
  createOrder: async (orderData: OrderData) => {
    try {
      const response = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getIdToken()}`
        },
        body: JSON.stringify(orderData)
      });
      return await response.json();
    } catch (error) {
      console.error('Order creation failed:', error);
      throw error;
    }
  }
}));
```

### 2.2 Authentication Migration

```typescript
// Firebase Auth Implementation
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged 
} from 'firebase/auth';

export const AuthService = {
  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    const token = await userCredential.user.getIdToken();
    // Store token for API calls
    localStorage.setItem('authToken', token);
    return userCredential.user;
  },
  
  async register(email: string, password: string, userData: UserData) {
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    
    // Create user profile in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), userData);
    return userCredential.user;
  },
  
  subscribeToAuthChanges(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
};
```

### 2.3 Custom Hook Migration

```typescript
// Before: Mock data hook
const useRepairQuote = () => {
  const [quote, setQuote] = useState(mockQuoteData);
  // ...
};

// After: Firebase-connected hook
const useRepairQuote = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const calculateQuote = useCallback(async (deviceInfo: DeviceInfo) => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/quotes/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getIdToken()}`
        },
        body: JSON.stringify(deviceInfo)
      });
      
      const data = await response.json();
      setQuote(data);
      
      // Save to Firestore for real-time sync
      await addDoc(collection(db, 'quotes'), data);
      
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { quote, calculateQuote, loading, error };
};
```

## Phase 3: RAG Integration 

### 3.1 RAG Service Implementation

```python
# backend/app/services/rag_service.py
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
import pinecone

class RAGService:
    def __init__(self):
        # Initialize Pinecone
        pinecone.init(
            api_key=settings.PINECONE_API_KEY,
            environment=settings.PINECONE_ENV
        )
        
        # Setup embeddings and vector store
        self.embeddings = OpenAIEmbeddings()
        self.index = pinecone.Index("vibe-code-knowledge")
        self.vectorstore = Pinecone(
            self.index, 
            self.embeddings, 
            "text"
        )
        
        # Setup QA chain
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=OpenAI(temperature=0.7),
            chain_type="stuff",
            retriever=self.vectorstore.as_retriever(
                search_kwargs={"k": 3}
            )
        )
    
    async def query(self, question: str) -> dict:
        try:
            # Retrieve and generate response
            response = await self.qa_chain.arun(question)
            
            # Get source documents
            docs = self.vectorstore.similarity_search(question, k=3)
            sources = [doc.metadata for doc in docs]
            
            return {
                "answer": response,
                "sources": sources,
                "confidence": self.calculate_confidence(docs)
            }
        except Exception as e:
            return {
                "answer": "I'm sorry, I couldn't process your question.",
                "error": str(e)
            }
    
    def calculate_confidence(self, docs):
        # Calculate confidence based on similarity scores
        if not docs:
            return 0
        scores = [doc.score for doc in docs if hasattr(doc, 'score')]
        return sum(scores) / len(scores) if scores else 0.5
```

### 3.2 Chatbot Widget Integration

```typescript
// components/ChatbotWidget.tsx
import { useState, useEffect, useCallback } from 'react';
import { useAuthState } from '../hooks/useAuth';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sources?: Source[];
}

export const ChatbotWidget: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthState();
  
  const sendMessage = useCallback(async (text: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/chatbot/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getIdToken()}`
        },
        body: JSON.stringify({ 
          question: text,
          context: {
            userId: user?.uid,
            sessionId: getSessionId(),
            previousMessages: messages.slice(-5)
          }
        })
      });
      
      const data = await response.json();
      
      // Add bot response
      const botMessage: ChatMessage = {
        id: generateId(),
        text: data.answer,
        sender: 'bot',
        timestamp: new Date(),
        sources: data.sources
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Save to Firestore for history
      await saveMessageToFirestore(userMessage, botMessage);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message
      setMessages(prev => [...prev, {
        id: generateId(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, user]);
  
  return (
    <div className="chatbot-widget">
      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput onSend={sendMessage} disabled={isLoading} />
    </div>
  );
};
```

### 3.3 Knowledge Base Update Pipeline

```python
# backend/app/services/knowledge_updater.py
import asyncio
from typing import List, Dict
import schedule

class KnowledgeUpdater:
    def __init__(self, rag_service: RAGService):
        self.rag_service = rag_service
        self.sources = [
            FirestoreSource(),
            DocumentSource(),
            FAQSource()
        ]
    
    async def update_knowledge_base(self):
        """Update the RAG knowledge base with new content"""
        all_documents = []
        
        for source in self.sources:
            documents = await source.fetch_documents()
            all_documents.extend(documents)
        
        # Process and embed documents
        processed_docs = self.process_documents(all_documents)
        
        # Update vector database
        await self.rag_service.vectorstore.add_documents(processed_docs)
        
        return {
            "documents_processed": len(processed_docs),
            "timestamp": datetime.now()
        }
    
    def schedule_updates(self):
        """Schedule regular knowledge base updates"""
        schedule.every(6).hours.do(
            lambda: asyncio.create_task(self.update_knowledge_base())
        )
        
        while True:
            schedule.run_pending()
            asyncio.sleep(60)
```

## Phase 4: Testing and Optimization

### 4.1 Performance Monitoring

```typescript
// utils/performance.ts
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  
  async measureAPICall<T>(
    name: string, 
    apiCall: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();
    
    try {
      const result = await apiCall();
      const duration = performance.now() - start;
      
      this.recordMetric(name, duration);
      
      if (duration > 200) {
        console.warn(`Slow API call: ${name} took ${duration}ms`);
      }
      
      return result;
    } catch (error) {
      this.recordError(name, error);
      throw error;
    }
  }
  
  private recordMetric(name: string, duration: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(duration);
    
    // Send to analytics
    if (window.analytics) {
      window.analytics.track('API Performance', {
        endpoint: name,
        duration,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  getAverageResponseTime(name: string): number {
    const times = this.metrics.get(name) || [];
    return times.length > 0 
      ? times.reduce((a, b) => a + b, 0) / times.length 
      : 0;
  }
}
```

### 4.2 Real-time Optimization

```typescript
// hooks/useOptimizedFirestore.ts
import { useEffect, useRef, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  limit, 
  onSnapshot,
  QuerySnapshot,
  DocumentData 
} from 'firebase/firestore';

export function useOptimizedFirestore<T>(
  collectionName: string,
  queryConstraints: any[] = [],
  options: {
    realtime?: boolean;
    cacheTime?: number;
    pageSize?: number;
  } = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const unsubscribe = useRef<(() => void) | null>(null);
  const cache = useRef<Map<string, { data: T[], timestamp: number }>>(new Map());
  
  const fetchData = useCallback(async () => {
    const cacheKey = JSON.stringify({ collectionName, queryConstraints });
    const cached = cache.current.get(cacheKey);
    
    // Check cache validity
    if (cached && Date.now() - cached.timestamp < (options.cacheTime || 60000)) {
      setData(cached.data);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    try {
      const q = query(
        collection(db, collectionName),
        ...queryConstraints,
        limit(options.pageSize || 50)
      );
      
      if (options.realtime) {
        // Real-time subscription
        unsubscribe.current = onSnapshot(
          q,
          (snapshot: QuerySnapshot<DocumentData>) => {
            const items = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            } as T));
            
            setData(items);
            cache.current.set(cacheKey, { data: items, timestamp: Date.now() });
            setLoading(false);
          },
          (err) => {
            setError(err);
            setLoading(false);
          }
        );
      } else {
        // One-time fetch
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as T));
        
        setData(items);
        cache.current.set(cacheKey, { data: items, timestamp: Date.now() });
        setLoading(false);
      }
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, [collectionName, queryConstraints, options]);
  
  useEffect(() => {
    fetchData();
    
    return () => {
      if (unsubscribe.current) {
        unsubscribe.current();
      }
    };
  }, [fetchData]);
  
  return { data, loading, error, refetch: fetchData };
}
```

---