# 🤖 Gemini API Migration Guide

This document outlines the migration from OpenAI to Google Gemini API for the iRepair Pro application.

## Overview

The application has been migrated from:
- **OpenAI API** → **Google Gemini API**
- **OpenAI Embeddings** → **Gemini Embeddings**
- **Vector dimension 1536** → **Vector dimension 768**

## Key Changes

### 1. Dependencies Updated
- **Removed**: `openai`, `langchain-openai`
- **Added**: `google-generativeai`, `langchain-google-genai`

### 2. Configuration Changes
- **Environment Variable**: `OPENAI_API_KEY` → `GEMINI_API_KEY`
- **Vector Dimension**: Updated from 1536 to 768 for Gemini embeddings
- **Model**: `gpt-4` → `gemini-pro`

### 3. API Changes
- **Embeddings**: Now using `models/embedding-001` from Gemini
- **Text Generation**: Using `gemini-pro` model
- **Response Format**: Updated to handle Gemini's response structure

## Setup Instructions

### 1. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Update Environment Variables
```bash
# Backend .env
GEMINI_API_KEY=your-gemini-api-key-here

# Remove or comment out
# OPENAI_API_KEY=your-openai-api-key
```

### 3. Install New Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 4. Update Database Schema
If you have existing data, you'll need to update the vector dimension:

```sql
-- Update existing knowledge_chunks table
ALTER TABLE knowledge_chunks 
ALTER COLUMN embedding TYPE VECTOR(768);

-- Recreate the index
DROP INDEX IF EXISTS knowledge_chunks_embedding_idx;
CREATE INDEX knowledge_chunks_embedding_idx ON knowledge_chunks 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

### 5. Re-embed Existing Documents
If you have existing knowledge documents, you'll need to re-embed them:

```python
# This will be handled automatically by the RAG service
# when documents are accessed, but you can force re-embedding:

from app.services.rag_service import rag_service

# Re-embed all documents
await rag_service.re_embed_all_documents()
```

## Benefits of Gemini

### 1. **Cost Effective**
- Free tier with generous limits
- Lower cost per token compared to OpenAI
- No usage-based pricing for embeddings

### 2. **Better Performance**
- Faster response times
- More efficient embeddings (768 vs 1536 dimensions)
- Better multilingual support

### 3. **Google Integration**
- Seamless integration with Google services
- Access to Google's latest AI models
- Regular updates and improvements

## API Usage Examples

### Basic Text Generation
```python
import google.generativeai as genai

genai.configure(api_key="your-api-key")
model = genai.GenerativeModel('gemini-pro')

response = model.generate_content("Hello, how are you?")
print(response.text)
```

### With Generation Config
```python
response = model.generate_content(
    "Your prompt here",
    generation_config=genai.types.GenerationConfig(
        temperature=0.7,
        max_output_tokens=1000,
        top_p=0.8,
        top_k=40
    )
)
```

### Embeddings
```python
from langchain.embeddings import GoogleGenerativeAIEmbeddings

embeddings = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    google_api_key="your-api-key"
)

# Generate embedding
embedding = embeddings.embed_query("Your text here")
```

## Troubleshooting

### Common Issues

#### 1. **API Key Errors**
```
Error: Invalid API key provided
```
**Solution**:
- Verify API key is correct
- Check API key has proper permissions
- Ensure API key is not expired

#### 2. **Vector Dimension Mismatch**
```
Error: vector dimension mismatch
```
**Solution**:
- Update database schema to use 768 dimensions
- Re-embed existing documents
- Check embedding model configuration

#### 3. **Rate Limiting**
```
Error: Quota exceeded
```
**Solution**:
- Check your API usage in Google AI Studio
- Implement rate limiting in your application
- Consider upgrading your plan

### Debug Steps

1. **Test API Key**
   ```python
   import google.generativeai as genai
   genai.configure(api_key="your-api-key")
   model = genai.GenerativeModel('gemini-pro')
   response = model.generate_content("Test")
   print(response.text)
   ```

2. **Test Embeddings**
   ```python
   from langchain.embeddings import GoogleGenerativeAIEmbeddings
   embeddings = GoogleGenerativeAIEmbeddings(
       model="models/embedding-001",
       google_api_key="your-api-key"
   )
   result = embeddings.embed_query("Test")
   print(f"Embedding dimension: {len(result)}")
   ```

3. **Check Vector Database**
   ```sql
   SELECT vector_dims(embedding) FROM knowledge_chunks LIMIT 1;
   ```

## Migration Checklist

- [ ] Get Gemini API key from Google AI Studio
- [ ] Update environment variables
- [ ] Install new dependencies
- [ ] Update database schema (if needed)
- [ ] Test API connectivity
- [ ] Test embeddings generation
- [ ] Test RAG functionality
- [ ] Re-embed existing documents (if any)
- [ ] Update documentation
- [ ] Deploy to production

## Support Resources

- **Gemini Documentation**: [ai.google.dev/docs](https://ai.google.dev/docs)
- **Google AI Studio**: [makersuite.google.com](https://makersuite.google.com)
- **LangChain Gemini Integration**: [python.langchain.com/docs/integrations/llms/google_vertex_ai](https://python.langchain.com/docs/integrations/llms/google_vertex_ai)
- **Community Support**: [Google AI Community](https://discuss.ai.google.dev/)

## Performance Comparison

| Feature | OpenAI | Gemini |
|---------|--------|--------|
| Embedding Dimension | 1536 | 768 |
| Model | gpt-4 | gemini-pro |
| Cost | Higher | Lower |
| Speed | Good | Better |
| Multilingual | Good | Excellent |
| Free Tier | Limited | Generous |

The migration to Gemini provides better performance, lower costs, and improved multilingual capabilities for the iRepair Pro application.
