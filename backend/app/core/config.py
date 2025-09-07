"""
Configuration settings for the iRepair Pro Backend
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    APP_NAME: str = "iRepair Pro API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1", "*.vercel.app"]
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://irepair-pro.vercel.app"
    ]
    
    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    
    # Gemini
    GEMINI_API_KEY: str = ""
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost/irepair_pro"
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW: int = 60  # seconds
    
    # Caching
    REDIS_URL: Optional[str] = None
    CACHE_TTL: int = 300  # 5 minutes
    
    # Monitoring
    SENTRY_DSN: Optional[str] = None
    
    # File Upload
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    UPLOAD_DIR: str = "uploads"
    
    # API Configuration
    ENABLE_DOCS: bool = True
    ENABLE_REDOC: bool = True
    API_VERSION: str = "v1"
    API_PREFIX: str = "/api/v1"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"
    
    # CORS
    ENABLE_CORS: bool = True
    ENABLE_HTTPS_REDIRECT: bool = False
    
    # Health Check
    HEALTH_CHECK_ENDPOINT: str = "/health"
    HEALTH_CHECK_INTERVAL: int = 30
    
    # Vector Search (RAG)
    VECTOR_DIMENSION: int = 768
    VECTOR_SIMILARITY_THRESHOLD: float = 0.7
    MAX_SIMILARITY_RESULTS: int = 5
    
    # Order Management
    DEFAULT_ORDER_STATUS: str = "recu"
    ORDER_EXPIRY_DAYS: int = 30
    TRACKING_ID_PREFIX: str = "IRP"
    
    # Quote System
    QUOTE_EXPIRY_HOURS: int = 24
    DEFAULT_QUOTE_STATUS: str = "pending"
    
    # Email Configuration
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = "your-email@gmail.com"
    SMTP_PASSWORD: str = "your-app-password"
    SMTP_USE_TLS: bool = True
    
    # Payment (Stripe)
    STRIPE_PUBLIC_KEY: str = "pk_test_your-stripe-public-key"
    STRIPE_SECRET_KEY: str = "sk_test_your-stripe-secret-key"
    STRIPE_WEBHOOK_SECRET: str = "whsec_your-webhook-secret"
    
    # Analytics
    GA_TRACKING_ID: str = "G-XXXXXXXXXX"
    
    # Backup
    BACKUP_ENABLED: bool = False
    BACKUP_SCHEDULE: str = "0 2 * * *"
    BACKUP_RETENTION_DAYS: int = 30
    
    # Database Pool
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20
    DB_POOL_TIMEOUT: int = 30
    
    # Worker Configuration
    WORKER_PROCESSES: int = 4
    WORKER_CONNECTIONS: int = 1000
    
    # Feature Flags
    ENABLE_CHATBOT: bool = True
    ENABLE_ORDER_TRACKING: bool = True
    ENABLE_QUOTE_SYSTEM: bool = True
    ENABLE_ADMIN_PANEL: bool = True
    ENABLE_ANALYTICS: bool = False
    ENABLE_NOTIFICATIONS: bool = False
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"  # Allow extra fields from environment


# Create settings instance
settings = Settings()

# Ensure upload directory exists
upload_dir = Path(settings.UPLOAD_DIR)
upload_dir.mkdir(exist_ok=True)




