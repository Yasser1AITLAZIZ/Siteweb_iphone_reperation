# 🧪 **Guide de Test Complet - iRepair Pro Backend**

## 📋 **Vue d'Ensemble**

Ce guide vous explique comment tester le backend iRepair Pro de différentes manières, des tests unitaires aux tests de performance.

---

## 🚀 **Démarrage Rapide**

### **1. Tests Automatiques**
```bash
# Tests unitaires et d'intégration
python scripts/run_tests.py --type all

# Tests avec couverture
python scripts/run_tests.py --type coverage

# Suite complète (linting + tests + performance)
python scripts/run_tests.py --type full
```

### **2. Tests Manuels**
```bash
# Tests API basiques
python scripts/test_api.py

# Tests de performance
python scripts/performance_test.py

# Tests avec authentification (nécessite un token Firebase)
python scripts/test_with_auth.py --token "your-firebase-token" --user-id "user123"
```

---

## 🔧 **Configuration des Tests**

### **Prérequis**
```bash
# Installer les dépendances de test
pip install -r requirements.txt

# Installer pytest et extensions
pip install pytest pytest-asyncio pytest-cov httpx
```

### **Variables d'Environnement**
```bash
# Copier le fichier d'environnement
cp env.example .env

# Configurer les variables nécessaires pour les tests
# (Les tests utilisent des mocks, donc pas besoin de vraies clés API)
```

---

## 🧪 **Types de Tests**

### **1. Tests Unitaires**
Testent les services et la logique métier individuellement.

```bash
# Lancer les tests unitaires
python scripts/run_tests.py --type unit

# Ou directement avec pytest
pytest tests/test_services.py -v
```

**Ce qui est testé :**
- ✅ OrderService (création, mise à jour, suppression)
- ✅ QuoteService (calculs, validation)
- ✅ UserService (profils, préférences)
- ✅ RAGService (requêtes, documents)

### **2. Tests d'Intégration**
Testent les endpoints API avec des mocks.

```bash
# Lancer les tests d'intégration
python scripts/run_tests.py --type integration

# Ou directement avec pytest
pytest tests/test_api.py -v
```

**Ce qui est testé :**
- ✅ Endpoints Orders API
- ✅ Endpoints Quotes API
- ✅ Endpoints Users API
- ✅ Endpoints Chatbot API
- ✅ Authentification et autorisation
- ✅ Gestion d'erreurs

### **3. Tests de Performance**
Testent les performances et la charge.

```bash
# Tests de performance basiques
python scripts/performance_test.py

# Tests avec paramètres personnalisés
python scripts/performance_test.py --endpoint "/health" --iterations 50

# Tests concurrents
python scripts/performance_test.py --concurrent 20
```

**Métriques mesurées :**
- ⏱️ Temps de réponse moyen
- 📊 Percentiles (P95, P99)
- 🚀 Requêtes par seconde
- ✅ Taux de succès
- 🔄 Tests concurrents

### **4. Tests Manuels**
Tests interactifs pour valider le comportement.

```bash
# Tests API basiques (sans authentification)
python scripts/test_api.py

# Tests avec authentification Firebase
python scripts/test_with_auth.py --token "firebase-token" --user-id "user123"

# Test d'un endpoint spécifique
python scripts/test_api.py --test "health_check"
```

---

## 🔍 **Tests Spécifiques**

### **Test de Santé (Health Check)**
```bash
# Test rapide
curl http://localhost:8000/health

# Avec le script
python scripts/test_api.py --test "health_check"
```

**Résultat attendu :**
```json
{
  "status": "healthy",
  "service": "iRepair Pro API",
  "version": "1.0.0",
  "timestamp": 1703123456.789
}
```

### **Test de Documentation API**
```bash
# Accéder à Swagger UI
open http://localhost:8000/docs

# Test programmatique
python scripts/test_api.py --test "docs_endpoint"
```

### **Test des Services Disponibles**
```bash
# Endpoint public
curl http://localhost:8000/api/v1/quotes/services/available

# Avec le script
python scripts/test_api.py --test "quotes_services"
```

### **Test d'Authentification**
```bash
# Sans token (doit échouer)
curl http://localhost:8000/api/v1/users/profile

# Avec token Firebase
python scripts/test_with_auth.py --token "your-token" --user-id "user123"
```

---

## 🚀 **Tests de Performance Avancés**

### **Test de Charge**
```bash
# Test de charge basique
python scripts/performance_test.py

# Test avec plus d'itérations
python scripts/performance_test.py --iterations 100

# Test d'un endpoint spécifique
python scripts/performance_test.py --endpoint "/api/v1/quotes/services/available"
```

### **Test Concurrent**
```bash
# Test avec 20 utilisateurs simultanés
python scripts/performance_test.py --concurrent 20

# Test de stress
python scripts/performance_test.py --concurrent 50 --iterations 20
```

### **Métriques de Performance**

| Métrique | Objectif | Acceptable |
|----------|----------|------------|
| Temps de réponse moyen | < 200ms | < 500ms |
| P95 temps de réponse | < 500ms | < 1000ms |
| Taux de succès | > 99% | > 95% |
| Requêtes/seconde | > 100 | > 50 |

---

## 🔧 **Tests avec Authentification**

### **Obtenir un Token Firebase**
```javascript
// Dans le frontend ou console Firebase
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();
const userCredential = await signInWithEmailAndPassword(auth, 'email', 'password');
const token = await userCredential.user.getIdToken();
console.log('Token:', token);
```

### **Tests Authentifiés**
```bash
# Test complet avec authentification
python scripts/test_with_auth.py --token "firebase-token" --user-id "user123"

# Test d'un endpoint spécifique
python scripts/test_with_auth.py --token "firebase-token" --user-id "user123" --test "user_profile"
```

**Endpoints testés :**
- ✅ Profil utilisateur
- ✅ Création de devis
- ✅ Calcul de devis
- ✅ Création de commande
- ✅ Liste des commandes
- ✅ Chatbot
- ✅ Requêtes RAG
- ✅ Recherche dans la base de connaissances

---

## 📊 **Rapports de Test**

### **Couverture de Code**
```bash
# Générer le rapport de couverture
python scripts/run_tests.py --type coverage

# Le rapport HTML sera dans htmlcov/index.html
open htmlcov/index.html
```

### **Rapport de Performance**
```bash
# Test de performance avec rapport détaillé
python scripts/performance_test.py > performance_report.txt

# Analyse des résultats
cat performance_report.txt
```

### **Rapport de Linting**
```bash
# Vérification du code
python scripts/run_tests.py --type lint

# Correction automatique
black app/ tests/
isort app/ tests/
```

---

## 🐛 **Débogage des Tests**

### **Tests qui Échouent**
```bash
# Mode verbeux pour plus de détails
pytest tests/test_api.py -v -s

# Arrêter au premier échec
pytest tests/test_api.py -x

# Afficher les print statements
pytest tests/test_api.py -s
```

### **Tests Lents**
```bash
# Identifier les tests lents
pytest tests/ --durations=10

# Marquer les tests lents
pytest tests/ -m "not slow"
```

### **Tests avec Mocks**
```bash
# Vérifier les appels de mocks
pytest tests/test_services.py -v -s

# Debug des mocks
python -c "
import sys
sys.path.append('.')
from tests.conftest import mock_firebase
print('Mock configuré:', mock_firebase)
"
```

---

## 🔄 **Tests en CI/CD**

### **GitHub Actions**
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.11
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run tests
        run: python scripts/run_tests.py --type full
```

### **Tests Locaux Pré-commit**
```bash
# Hook pre-commit
#!/bin/sh
python scripts/run_tests.py --type lint
python scripts/run_tests.py --type unit
```

---

## 📈 **Optimisation des Tests**

### **Tests Parallèles**
```bash
# Installer pytest-xdist
pip install pytest-xdist

# Lancer les tests en parallèle
pytest tests/ -n auto
```

### **Cache des Tests**
```bash
# Installer pytest-cache
pip install pytest-cache

# Utiliser le cache
pytest tests/ --cache-clear
```

### **Tests Sélectifs**
```bash
# Tests par marqueur
pytest tests/ -m "unit"
pytest tests/ -m "integration"
pytest tests/ -m "not slow"

# Tests par pattern
pytest tests/ -k "test_order"
pytest tests/ -k "not test_rag"
```

---

## 🎯 **Bonnes Pratiques**

### **Écriture de Tests**
1. **Nommage clair** : `test_create_order_success`
2. **Un test, une fonctionnalité** : Un test par cas d'usage
3. **Données de test réalistes** : Utiliser des données proches de la production
4. **Nettoyage** : Nettoyer les données après chaque test

### **Organisation**
1. **Tests unitaires** : `tests/test_services.py`
2. **Tests d'intégration** : `tests/test_api.py`
3. **Fixtures communes** : `tests/conftest.py`
4. **Scripts de test** : `scripts/test_*.py`

### **Maintenance**
1. **Mettre à jour les mocks** quand l'API change
2. **Ajouter des tests** pour les nouvelles fonctionnalités
3. **Surveiller la couverture** de code
4. **Optimiser les tests lents**

---

## 🆘 **Résolution de Problèmes**

### **Erreurs Communes**

#### **"Module not found"**
```bash
# Vérifier le PYTHONPATH
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Ou utiliser python -m
python -m pytest tests/
```

#### **"Firebase not initialized"**
```bash
# Les tests utilisent des mocks, pas de vraie configuration Firebase
# Vérifier que les mocks sont bien configurés dans conftest.py
```

#### **"Tests timeout"**
```bash
# Augmenter le timeout
pytest tests/ --timeout=300

# Ou marquer les tests lents
pytest tests/ -m "not slow"
```

#### **"Import errors"**
```bash
# Vérifier les dépendances
pip install -r requirements.txt

# Vérifier la structure des imports
python -c "from app.main import app; print('Import OK')"
```

---

## 📞 **Support**

### **Documentation**
- **API Docs** : `http://localhost:8000/docs`
- **Tests** : `tests/` directory
- **Scripts** : `scripts/` directory

### **Commandes Utiles**
```bash
# Vérifier que le serveur fonctionne
curl http://localhost:8000/health

# Lancer tous les tests
python scripts/run_tests.py --type full

# Test rapide
python scripts/test_api.py

# Performance
python scripts/performance_test.py
```

### **Logs et Debug**
```bash
# Activer les logs détaillés
export LOG_LEVEL=DEBUG
python run.py

# Logs des tests
pytest tests/ -v -s --log-cli-level=DEBUG
```

---

**🎉 Avec ce guide, vous pouvez tester complètement le backend iRepair Pro !**


