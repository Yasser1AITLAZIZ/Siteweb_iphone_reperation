import React from 'react'
import { Link } from 'react-router-dom'
import { FadeInUp, HoverCard } from '../components/animations'

export default function Boutique() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <FadeInUp>
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              🛍️ Boutique iRepair Pro
            </h1>
          </FadeInUp>
          
          <FadeInUp delay={0.2}>
            <p className="text-xl text-gray-600 mb-8">
              Pièces détachées et accessoires iPhone au Maroc
            </p>
          </FadeInUp>
          
          {/* Catégories de produits avec animations */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
            <FadeInUp delay={0.4}>
              <HoverCard>
                <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="text-4xl mb-4">📱</div>
                  <h3 className="text-xl font-semibold mb-2">Écrans iPhone</h3>
                  <p className="text-gray-600 mb-4">Écrans de remplacement qualité OEM</p>
                  <p className="text-2xl font-bold text-purple-600">À partir de 199 DH</p>
                </div>
              </HoverCard>
            </FadeInUp>
            
            <FadeInUp delay={0.5}>
              <HoverCard>
                <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="text-4xl mb-4">🔋</div>
                  <h3 className="text-xl font-semibold mb-2">Batteries</h3>
                  <p className="text-gray-600 mb-4">Batteries haute capacité</p>
                  <p className="text-2xl font-bold text-purple-600">À partir de 149 DH</p>
                </div>
              </HoverCard>
            </FadeInUp>
            
            <FadeInUp delay={0.6}>
              <HoverCard>
                <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="text-4xl mb-4">📷</div>
                  <h3 className="text-xl font-semibold mb-2">Caméras</h3>
                  <p className="text-gray-600 mb-4">Modules caméra authentiques</p>
                  <p className="text-2xl font-bold text-purple-600">À partir de 299 DH</p>
                </div>
              </HoverCard>
            </FadeInUp>
            
            <FadeInUp delay={0.7}>
              <HoverCard>
                <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="text-4xl mb-4">🔌</div>
                  <h3 className="text-xl font-semibold mb-2">Connecteurs</h3>
                  <p className="text-gray-600 mb-4">Ports de charge et connecteurs</p>
                  <p className="text-2xl font-bold text-purple-600">À partir de 89 DH</p>
                </div>
              </HoverCard>
            </FadeInUp>
          </div>
          
          {/* Accessoires avec animations */}
          <FadeInUp delay={0.8}>
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-6">Accessoires Premium</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <HoverCard>
                  <div className="text-center">
                    <div className="text-3xl mb-3">🎧</div>
                    <h3 className="font-semibold mb-2">AirPods Pro</h3>
                    <p className="text-gray-600 mb-2">Qualité son exceptionnelle</p>
                    <p className="text-xl font-bold text-purple-600">1 299 DH</p>
                  </div>
                </HoverCard>
                <HoverCard>
                  <div className="text-center">
                    <div className="text-3xl mb-3">🔋</div>
                    <h3 className="font-semibold mb-2">Chargeur MagSafe</h3>
                    <p className="text-gray-600 mb-2">Chargement sans fil rapide</p>
                    <p className="text-xl font-bold text-purple-600">399 DH</p>
                  </div>
                </HoverCard>
                <HoverCard>
                  <div className="text-center">
                    <div className="text-3xl mb-3">📱</div>
                    <h3 className="font-semibold mb-2">Coque Protection</h3>
                    <p className="text-gray-600 mb-2">Protection maximale</p>
                    <p className="text-xl font-bold text-purple-600">199 DH</p>
                  </div>
                </HoverCard>
              </div>
            </div>
          </FadeInUp>
          
          {/* Navigation avec animation */}
          <FadeInUp delay={1.0}>
            <div className="flex justify-center space-x-4">
              <Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                ← Retour à l'accueil
              </Link>
              <Link to="/reparations" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                🔧 Réparations
              </Link>
            </div>
          </FadeInUp>
          
        </div>
      </div>
    </div>
  )
}