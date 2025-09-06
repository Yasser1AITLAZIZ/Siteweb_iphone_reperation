# Supabase Migration Guide

This document outlines the migration from Firebase + Pinecone to Supabase for the iRepair Pro application.

## Overview

The application has been migrated from:
- **Firebase Auth + Firestore** → **Supabase Auth + PostgreSQL**
- **Pinecone Vector Database** → **Supabase with pgvector extension**
- **OpenAI API** → **Google Gemini API**

## 🚀 Quick Start

If you want to get the application running quickly:

1. **Create Supabase Project** (5 minutes)
2. **Run Database Schema** (2 minutes)
3. **Configure Environment** (3 minutes)
4. **Install & Run** (5 minutes)

**Total setup time: ~15 minutes**

## Backend Changes

### 1. Dependencies Updated
- Removed: `firebase-admin`, `google-cloud-firestore`, `pinecone-client`, `openai`
- Added: `supabase`, `postgrest`, `realtime`, `pgvector`, `google-generativeai`, `langchain-google-genai`

### 2. Configuration
- Updated `backend/app/core/config.py` to use Supabase settings
- Created `backend/app/core/supabase.py` for Supabase client and auth functions
- Removed `backend/app/core/firebase.py`

### 3. Services Updated
- **User Service**: Migrated from Firestore to Supabase PostgreSQL
- **RAG Service**: Migrated from Pinecone to Supabase with pgvector and Gemini
- **Security**: Updated authentication to use Supabase JWT tokens

### 4. Database Schema
- Created `backend/supabase_schema.sql` with complete database schema
- Includes tables for users, orders, quotes, phone models, repair services
- Implements Row Level Security (RLS) policies
- Sets up pgvector for AI embeddings

## Frontend Changes

### 1. Dependencies
- Added `@supabase/supabase-js` for Supabase client

### 2. Authentication
- Updated `frontend/src/contexts/AuthContext.tsx` to use Supabase Auth
- Created `frontend/src/lib/supabase.ts` for Supabase configuration

### 3. Environment Variables
Create a `.env` file in the frontend directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:8000/api/v1
```

## Setup Instructions

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `irepair-pro`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
6. Wait for project creation (2-3 minutes)
7. Note down your project URL and API keys

### 2. Set up Database
1. Go to your Supabase project dashboard
2. Navigate to "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the entire content from `backend/supabase_schema.sql`
5. Click "Run" to execute the schema
6. Verify tables are created in "Table Editor"

### 3. Enable pgvector Extension
1. In Supabase dashboard, go to "Database" → "Extensions"
2. Search for "pgvector"
3. Click "Enable" to activate the extension
4. This enables vector similarity search for the RAG system

### 4. Configure Environment Variables

#### Backend (.env)
1. Copy the example environment file:
   ```bash
   cd backend
   cp env.example .env
   ```

2. Edit the `.env` file with your actual values:
```env
# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Database Connection
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

# Gemini Configuration
GEMINI_API_KEY=your-gemini-api-key

# Application Configuration
SECRET_KEY=your-super-secret-key-here-change-in-production
ENVIRONMENT=development
DEBUG=true
HOST=0.0.0.0
PORT=8000

# CORS Configuration
ALLOWED_ORIGINS=["http://localhost:3000", "http://localhost:5173", "https://irepair-pro.vercel.app"]
ALLOWED_HOSTS=["localhost", "127.0.0.1", "*.vercel.app"]

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads

# Optional: Redis for caching
REDIS_URL=redis://localhost:6379
CACHE_TTL=300

# Optional: Monitoring
SENTRY_DSN=your-sentry-dsn-if-using
```

#### Frontend (.env)
1. Copy the example environment file:
   ```bash
   cd frontend
   cp env.example .env
   ```

2. Edit the `.env` file with your actual values:
   ```env
   # Required variables
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_API_URL=http://localhost:8000/api/v1
   
   # Optional variables (can be left as defaults)
   VITE_APP_NAME=iRepair Pro
   VITE_ENABLE_CHATBOT=true
   VITE_ENABLE_ORDER_TRACKING=true
   VITE_ENABLE_QUOTE_SYSTEM=true
   VITE_ENABLE_ADMIN_PANEL=true
   ```

### 5. Install Dependencies

#### Option A: Automated Setup (Recommended)
```bash
# Backend - Run setup script
cd backend
python setup.py

# Frontend
cd frontend
npm install
```

#### Option B: Manual Setup
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### 6. Initialize Database Data (Optional)
```bash
# Backend - Initialize sample data
cd backend
python scripts/init_data.py
```

### 7. Run the Application
```bash
# Terminal 1 - Backend
cd backend
python run.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 8. Verify Installation
1. **Backend Health Check**: Visit `http://localhost:8000/health`
2. **API Documentation**: Visit `http://localhost:8000/docs`
3. **Frontend**: Visit `http://localhost:5173`
4. **Test Authentication**: Try registering a new user
5. **Test RAG**: Try the chatbot functionality

## Key Features

### Authentication
- Supabase Auth with email/password
- JWT token-based authentication
- Row Level Security for data protection

### Vector Search
- pgvector extension for AI embeddings
- Gemini embeddings for RAG functionality
- Similarity search for knowledge base

### Database Features
- PostgreSQL with full ACID compliance
- Real-time subscriptions
- Automatic API generation
- Built-in authentication and authorization

## Migration Benefits

1. **Unified Platform**: Single platform for auth, database, and real-time features
2. **Better Performance**: PostgreSQL with optimized queries and indexes
3. **Cost Effective**: Single service instead of multiple providers
4. **Developer Experience**: Better tooling and documentation
5. **Scalability**: Built-in scaling and performance optimizations

## Testing

After migration, test the following features:
1. User registration and login
2. Profile management
3. Order creation and tracking
4. Chatbot functionality with RAG
5. Admin panel access
6. Real-time updates

## Troubleshooting

### Common Issues

#### 1. **CORS Errors**
```
Error: CORS policy: No 'Access-Control-Allow-Origin' header
```
**Solution**: 
- Check `ALLOWED_ORIGINS` in backend `.env`
- Ensure frontend URL is included in the list
- Restart backend server after changes

#### 2. **Authentication Errors**
```
Error: Invalid authentication token
```
**Solution**:
- Verify `SUPABASE_ANON_KEY` is correct
- Check that RLS policies are enabled
- Ensure user is properly registered

#### 3. **Database Connection Errors**
```
Error: connection to server at "db.xxx.supabase.co" failed
```
**Solution**:
- Verify `DATABASE_URL` format
- Check database password is correct
- Ensure pgvector extension is enabled

#### 4. **Vector Search Errors**
```
Error: pgvector extension not found
```
**Solution**:
- Enable pgvector extension in Supabase dashboard
- Restart the application
- Check database schema is properly applied

#### 5. **Gemini API Errors**
```
Error: Invalid API key provided
```
**Solution**:
- Verify `GEMINI_API_KEY` is correct
- Check API key has sufficient credits
- Ensure API key has proper permissions
- Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

#### 6. **Frontend Build Errors**
```
Error: Cannot resolve '@supabase/supabase-js'
```
**Solution**:
```bash
cd frontend
npm install @supabase/supabase-js
```

### Debug Steps

1. **Check Environment Variables**
   ```bash
   # Backend
   cd backend
   python -c "from app.core.config import settings; print(settings.SUPABASE_URL)"
   
   # Frontend
   cd frontend
   npm run dev
   # Check browser console for VITE_ variables
   ```

2. **Verify Database Connection**
   ```bash
   # Test database connection
   cd backend
   python -c "
   from app.core.supabase import get_supabase_client
   client = get_supabase_client()
   print('Supabase connected:', client is not None)
   "
   ```

3. **Check API Health**
   ```bash
   curl http://localhost:8000/health
   ```

4. **View Logs**
   ```bash
   # Backend logs
   cd backend
   python run.py
   
   # Frontend logs
   cd frontend
   npm run dev
   ```

### Support Resources

- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **Gemini Documentation**: [ai.google.dev/docs](https://ai.google.dev/docs)
- **Google AI Studio**: [makersuite.google.com](https://makersuite.google.com)
- **FastAPI Documentation**: [fastapi.tiangolo.com](https://fastapi.tiangolo.com)
- **React Documentation**: [react.dev](https://react.dev)

### Getting Help

1. **Check Logs**: Review both frontend and backend console logs
2. **Verify Configuration**: Ensure all environment variables are set correctly
3. **Test Components**: Test each component individually (auth, database, API)
4. **Community Support**: 
   - Supabase Discord: [discord.supabase.com](https://discord.supabase.com)
   - GitHub Issues: Create an issue in the repository
   - Stack Overflow: Tag with `supabase`, `fastapi`, `react`
