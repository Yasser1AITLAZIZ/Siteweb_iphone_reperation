# 🍎 iRepair Pro Backend API

> **Backend API pour le service de réparation iPhone avec chatbot RAG et intégration Supabase**

## 🏗️ **Architecture**

### **Stack Technique**
- **⚡ FastAPI** - Framework web moderne et rapide
- **🗄️ Supabase** - Authentification et base de données PostgreSQL
- **🤖 Gemini** - Intelligence artificielle pour le chatbot
- **📊 pgvector** - Extension PostgreSQL pour la recherche vectorielle RAG
- **🐍 Python 3.11+** - Langage de programmation
- **📝 Pydantic** - Validation et sérialisation des données

### **Structure du Projet**
```
backend/
├── app/
│   ├── main.py                 # Point d'entrée FastAPI
│   ├── core/                   # Configuration et utilitaires
│   │   ├── config.py          # Configuration de l'application
│   │   ├── supabase.py        # Configuration Supabase
│   │   ├── security.py        # Authentification et sécurité
│   │   └── exceptions.py      # Exceptions personnalisées
│   ├── models/                 # Modèles Pydantic
│   │   ├── user.py            # Modèles utilisateur
│   │   ├── order.py           # Modèles commande
│   │   ├── quote.py           # Modèles devis
│   │   └── chatbot.py         # Modèles chatbot
│   ├── services/               # Logique métier
│   │   ├── user_service.py    # Service utilisateur
│   │   ├── order_service.py   # Service commandes
│   │   ├── quote_service.py   # Service devis
│   │   └── rag_service.py     # Service RAG
│   └── api/                    # Endpoints API
│       └── v1/
│           ├── api.py         # Configuration des routes
│           └── endpoints/     # Endpoints spécifiques
├── scripts/                    # Scripts utilitaires
├── requirements.txt           # Dépendances Python
└── run.py                    # Serveur de développement
```

---

## 🚀 **Installation et Configuration**

### **1. Prérequis**
```bash
# Python 3.11+
python --version

# Node.js (pour le frontend)
node --version
```

### **2. Installation**
```bash
# Cloner le repository
git clone <repository-url>
cd backend

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Installer les dépendances
pip install -r requirements.txt
```

### **3. Configuration**
```bash
# Copier le fichier d'environnement
cp env.example .env

# Éditer les variables d'environnement
nano .env
```

### **4. Variables d'Environnement**
```env
# Supabase
SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Database
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# Gemini
GEMINI_API_KEY="your-gemini-api-key"

# Application
SECRET_KEY="your-secret-key-here"
ENVIRONMENT="development"
DEBUG=true
HOST="0.0.0.0"
PORT=8000
```

---

## 🔧 **Utilisation**

### **Développement**
```bash
# Démarrer le serveur de développement
python run.py

# Ou avec uvicorn directement
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### **Production**
```bash
# Build pour la production
pip install -r requirements.txt

# Démarrer avec Gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### **Initialisation des Données**
```bash
# Initialiser la base de données avec des données d'exemple
python scripts/init_data.py
```

---

## 📚 **API Documentation**

### **Endpoints Principaux**

#### **🔐 Authentification**
- `POST /api/v1/users/login` - Connexion utilisateur
- `POST /api/v1/users/register` - Inscription utilisateur
- `GET /api/v1/users/profile` - Profil utilisateur

#### **📋 Commandes**
- `POST /api/v1/orders` - Créer une commande
- `GET /api/v1/orders` - Lister les commandes
- `GET /api/v1/orders/{id}` - Détails d'une commande
- `PUT /api/v1/orders/{id}` - Modifier une commande
- `GET /api/v1/orders/tracking/{tracking_id}` - Suivi de commande

#### **💰 Devis**
- `POST /api/v1/quotes` - Créer un devis
- `POST /api/v1/quotes/calculate` - Calculer un devis
- `GET /api/v1/quotes` - Lister les devis
- `POST /api/v1/quotes/{id}/accept` - Accepter un devis
- `GET /api/v1/quotes/services/available` - Services disponibles

#### **🤖 Chatbot RAG**
- `POST /api/v1/chatbot/query` - Chat avec le bot
- `POST /api/v1/chatbot/rag/query` - Requête RAG directe
- `POST /api/v1/chatbot/knowledge/add` - Ajouter des documents
- `GET /api/v1/chatbot/knowledge/search` - Rechercher dans la base

### **Documentation Interactive**
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

## 🔒 **Sécurité**

### **Authentification Supabase**
```python
# Middleware d'authentification
from app.core.security import get_current_user

@router.get("/protected")
async def protected_endpoint(current_user: dict = Depends(get_current_user)):
    return {"user_id": current_user["uid"]}
```

### **Autorisation par Rôles**
```python
# Vérification des rôles
from app.core.security import require_admin, require_customer

@router.get("/admin-only")
async def admin_endpoint(current_user: dict = Depends(require_admin)):
    return {"message": "Admin access granted"}
```

### **Rate Limiting**
```python
# Limitation du taux de requêtes
from app.core.security import rate_limiter

# Appliqué automatiquement via middleware
```

---

## 🤖 **Système RAG**

### **Architecture RAG**
```
User Query → pgvector Search → Context Retrieval → Gemini Generation → Response
```

### **Configuration**
```python
# Service RAG avec Supabase pgvector et Gemini
from app.services.rag_service import rag_service

# Requête RAG
response = await rag_service.query(RAGQuery(
    question="Combien coûte une réparation d'écran?",
    context={"user_id": "user123"}
))
```

### **Base de Connaissances**
- **Documents FAQ** - Questions fréquentes
- **Informations de réparation** - Procédures et tarifs
- **Politiques** - Garanties et conditions
- **Contact** - Informations de contact

---

## 📊 **Monitoring et Logs**

### **Logs Structurés**
```python
import structlog

logger = structlog.get_logger()
logger.info("Order created", order_id="123", user_id="user456")
```

### **Métriques de Performance**
- Temps de réponse API
- Taux d'erreur
- Utilisation des ressources
- Performance RAG

### **Health Check**
```bash
curl http://localhost:8000/health
```

---

## 🧪 **Tests**

### **Tests Unitaires**
```bash
# Exécuter les tests
pytest tests/

# Avec couverture
pytest --cov=app tests/
```

### **Tests d'Intégration**
```bash
# Tests API
pytest tests/integration/

# Tests RAG
pytest tests/rag/
```

---

## 🚀 **Déploiement**

### **Docker**
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### **Vercel**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "run.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "run.py"
    }
  ]
}
```

---

## 🔧 **Développement**

### **Standards de Code**
```bash
# Formatage
black app/
isort app/

# Linting
flake8 app/
mypy app/
```

### **Structure des Commits**
```bash
feat: Add user authentication
fix: Resolve order status update issue
docs: Update API documentation
test: Add unit tests for order service
```

---

## 📈 **Performance**

### **Optimisations**
- **Cache Redis** - Mise en cache des requêtes fréquentes
- **Pagination** - Limitation des résultats
- **Index PostgreSQL** - Optimisation des requêtes avec pgvector
- **Pool de connexions** - Gestion des connexions DB
- **RLS Policies** - Sécurité au niveau des lignes

### **Métriques Cibles**
- **API Response Time** < 200ms
- **RAG Response Time** < 2s
- **Uptime** > 99.9%
- **Error Rate** < 0.1%

---

## 🤝 **Contribution**

### **Workflow**
1. Fork le repository
2. Créer une branche feature
3. Développer et tester
4. Soumettre une Pull Request

### **Code Review**
- [ ] Types et interfaces définis
- [ ] Gestion d'erreurs implémentée
- [ ] Tests écrits et passants
- [ ] Documentation mise à jour
- [ ] Performance optimisée

---

## 📞 **Support**

### **Documentation**
- **API Docs**: `/docs`
- **Architecture**: `ARCHITECTURE_ANALYSIS.md`
- **Frontend**: `../frontend/README.md`

### **Contact**
- **Email**: dev@irepair-pro.ma
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

---

**🎉 Le backend iRepair Pro est prêt pour l'intégration avec le frontend et les services externes !**


