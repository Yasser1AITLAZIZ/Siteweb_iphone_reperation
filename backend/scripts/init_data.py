"""
Initialize database with sample data
"""

import asyncio
import sys
import os
from datetime import datetime

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.firebase import initialize_firebase, get_firestore_client
from app.models.order import RepairService, ServiceCategory, PhoneModel
from app.models.chatbot import KnowledgeDocument


async def init_services():
    """Initialize repair services"""
    db = get_firestore_client()
    
    services = [
        {
            "id": "screen-replacement",
            "name": "Remplacement d'écran",
            "description": "Remplacement complet de l'écran avec vitre tactile",
            "price": 1490.0,
            "estimated_time": 2,
            "category": ServiceCategory.SCREEN,
            "is_available": True
        },
        {
            "id": "battery-replacement",
            "name": "Remplacement de batterie",
            "description": "Remplacement de la batterie avec garantie 12 mois",
            "price": 890.0,
            "estimated_time": 1,
            "category": ServiceCategory.BATTERY,
            "is_available": True
        },
        {
            "id": "camera-repair",
            "name": "Réparation caméra",
            "description": "Réparation ou remplacement de la caméra arrière/avant",
            "price": 1290.0,
            "estimated_time": 3,
            "category": ServiceCategory.CAMERA,
            "is_available": True
        },
        {
            "id": "speaker-repair",
            "name": "Réparation haut-parleur",
            "description": "Réparation du haut-parleur et du microphone",
            "price": 690.0,
            "estimated_time": 1,
            "category": ServiceCategory.AUDIO,
            "is_available": True
        },
        {
            "id": "charging-port",
            "name": "Réparation port de charge",
            "description": "Réparation du port de charge et connecteur",
            "price": 790.0,
            "estimated_time": 2,
            "category": ServiceCategory.CONNECTOR,
            "is_available": True
        }
    ]
    
    for service in services:
        db.collection("services").document(service["id"]).set(service)
        print(f"Added service: {service['name']}")


async def init_phone_models():
    """Initialize phone models"""
    db = get_firestore_client()
    
    models = [
        {
            "id": "iphone-15-pro-max",
            "brand": "Apple",
            "model": "iPhone 15 Pro Max",
            "year": 2023,
            "is_supported": True,
            "image_url": "/images/iphone-15-pro-max.jpg",
            "base_price": 200.0
        },
        {
            "id": "iphone-15-pro",
            "brand": "Apple",
            "model": "iPhone 15 Pro",
            "year": 2023,
            "is_supported": True,
            "image_url": "/images/iphone-15-pro.jpg",
            "base_price": 180.0
        },
        {
            "id": "iphone-14-pro-max",
            "brand": "Apple",
            "model": "iPhone 14 Pro Max",
            "year": 2022,
            "is_supported": True,
            "image_url": "/images/iphone-14-pro-max.jpg",
            "base_price": 160.0
        },
        {
            "id": "iphone-13-pro",
            "brand": "Apple",
            "model": "iPhone 13 Pro",
            "year": 2021,
            "is_supported": True,
            "image_url": "/images/iphone-13-pro.jpg",
            "base_price": 140.0
        },
        {
            "id": "iphone-12",
            "brand": "Apple",
            "model": "iPhone 12",
            "year": 2020,
            "is_supported": True,
            "image_url": "/images/iphone-12.jpg",
            "base_price": 120.0
        }
    ]
    
    for model in models:
        db.collection("phone_models").document(model["id"]).set(model)
        print(f"Added phone model: {model['model']}")


async def init_knowledge_base():
    """Initialize knowledge base for RAG"""
    db = get_firestore_client()
    
    knowledge_docs = [
        {
            "id": "repair-time-faq",
            "title": "Durée des réparations",
            "content": "La plupart de nos réparations sont effectuées en moins de 30 minutes. Les réparations d'écran prennent généralement 2 heures, les batteries 1 heure, et les caméras 3 heures. Nous offrons un service express pour les réparations urgentes.",
            "category": "faq",
            "tags": ["durée", "temps", "réparation", "rapide"],
            "metadata": {
                "source": "faq",
                "last_updated": datetime.now().isoformat(),
                "version": 1
            },
            "is_active": True,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "id": "warranty-info",
            "title": "Garantie sur les réparations",
            "content": "Toutes nos réparations bénéficient d'une garantie de 12 mois sur les pièces et la main d'œuvre. Nous utilisons exclusivement des pièces OEM (Original Equipment Manufacturer) de qualité Apple. La garantie couvre les défauts de fabrication mais pas les dommages accidentels.",
            "category": "warranty",
            "tags": ["garantie", "12 mois", "pièces", "OEM", "Apple"],
            "metadata": {
                "source": "warranty",
                "last_updated": datetime.now().isoformat(),
                "version": 1
            },
            "is_active": True,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "id": "pricing-info",
            "title": "Tarifs des réparations",
            "content": "Nos tarifs sont compétitifs et transparents. Écran: 1490 DH, Batterie: 890 DH, Caméra: 1290 DH, Haut-parleur: 690 DH, Port de charge: 790 DH. Les prix peuvent varier selon le modèle d'iPhone. Devis gratuit et sans engagement.",
            "category": "pricing",
            "tags": ["tarifs", "prix", "devis", "gratuit", "transparent"],
            "metadata": {
                "source": "pricing",
                "last_updated": datetime.now().isoformat(),
                "version": 1
            },
            "is_active": True,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        },
        {
            "id": "contact-info",
            "title": "Contact et rendez-vous",
            "content": "Vous pouvez prendre rendez-vous en ligne ou nous appeler au +212 5 22 34 56 78. Nous sommes ouverts du lundi au samedi de 9h à 19h. Adresse: 123 Rue Hassan II, Casablanca. Email: contact@irepair-pro.ma",
            "category": "contact",
            "tags": ["rendez-vous", "rdv", "appel", "téléphone", "adresse", "email"],
            "metadata": {
                "source": "contact",
                "last_updated": datetime.now().isoformat(),
                "version": 1
            },
            "is_active": True,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
    ]
    
    for doc in knowledge_docs:
        db.collection("knowledge_base").document(doc["id"]).set(doc)
        print(f"Added knowledge document: {doc['title']}")


async def main():
    """Main initialization function"""
    print("Initializing iRepair Pro database...")
    
    try:
        # Initialize Firebase
        initialize_firebase()
        print("Firebase initialized successfully")
        
        # Initialize data
        await init_services()
        await init_phone_models()
        await init_knowledge_base()
        
        print("\nDatabase initialization completed successfully!")
        print("You can now start the API server with: python run.py")
        
    except Exception as e:
        print(f"Error during initialization: {e}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())


