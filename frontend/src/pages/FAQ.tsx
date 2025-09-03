import React from 'react'
import { Link } from 'react-router-dom'

export default function FAQ() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            ❓ FAQ iRepair Pro
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Questions fréquentes sur nos services de réparation
          </p>
          
          {/* Questions fréquentes */}
          <div className="max-w-4xl mx-auto space-y-6 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-left">🔧 Combien de temps dure une réparation ?</h3>
              <p className="text-gray-600 text-left">
                La plupart de nos réparations sont effectuées en 30 minutes à 2 heures selon le type de problème. 
                Les réparations complexes peuvent prendre jusqu'à 24h.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-left">💰 Quels sont vos tarifs ?</h3>
              <p className="text-gray-600 text-left">
                Nos tarifs commencent à 199 DH pour une batterie, 299 DH pour un écran, et 399 DH pour une caméra. 
                Chaque devis est personnalisé selon votre modèle d'iPhone.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-left">🛡️ Quelle garantie offrez-vous ?</h3>
              <p className="text-gray-600 text-left">
                Toutes nos réparations sont garanties 12 mois. Nous utilisons des pièces de qualité OEM 
                et nos techniciens sont certifiés Apple.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-left">📍 Où êtes-vous situés ?</h3>
              <p className="text-gray-600 text-left">
                Notre atelier principal est situé à Casablanca, Maroc. Nous proposons aussi un service 
                de récupération à domicile et d'envoi par colis.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-left">📱 Quels modèles réparez-vous ?</h3>
              <p className="text-gray-600 text-left">
                Nous réparons tous les modèles d'iPhone, de l'iPhone 6 à l'iPhone 15 Pro Max. 
                Nous avons les pièces et l'expertise pour tous les modèles.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-3 text-left">⏰ Quels sont vos horaires ?</h3>
              <p className="text-gray-600 text-left">
                Nous sommes ouverts du lundi au samedi de 9h00 à 19h00, et le dimanche de 10h00 à 18h00. 
                Service d'urgence disponible sur rendez-vous.
              </p>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex justify-center space-x-4">
            <Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              ← Retour à l'accueil
            </Link>
            <Link to="/reparations" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
              🔧 Réparations
            </Link>
            <Link to="/boutique" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              🛍️ Boutique
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  )
}