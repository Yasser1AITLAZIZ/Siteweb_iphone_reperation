import React from 'react'
import { Link } from 'react-router-dom'
import { FadeInUp, HoverCard } from '../components/animations'

export default function Reparations() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <FadeInUp>
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              🔧 Réparations iPhone
            </h1>
          </FadeInUp>
          
          <FadeInUp delay={0.2}>
            <p className="text-xl text-gray-600 mb-8">
              Service express de réparation iPhone au Maroc
            </p>
          </FadeInUp>
          
          {/* Services de réparation avec animations */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            <FadeInUp delay={0.4}>
              <HoverCard>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="text-4xl mb-4">📱</div>
                  <h3 className="text-xl font-semibold mb-2">Écran iPhone</h3>
                  <p className="text-gray-600 mb-4">Remplacement d'écran en 30 minutes</p>
                  <p className="text-2xl font-bold text-green-600">À partir de 299 DH</p>
                </div>
              </HoverCard>
            </FadeInUp>
            
            <FadeInUp delay={0.5}>
              <HoverCard>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="text-4xl mb-4">🔋</div>
                  <h3 className="text-xl font-semibold mb-2">Batterie iPhone</h3>
                  <p className="text-gray-600 mb-4">Remplacement de batterie en 45 minutes</p>
                  <p className="text-2xl font-bold text-green-600">À partir de 199 DH</p>
                </div>
              </HoverCard>
            </FadeInUp>
            
            <FadeInUp delay={0.6}>
              <HoverCard>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="text-4xl mb-4">📷</div>
                  <h3 className="text-xl font-semibold mb-2">Caméra iPhone</h3>
                  <p className="text-gray-600 mb-4">Réparation caméra en 1 heure</p>
                  <p className="text-2xl font-bold text-green-600">À partir de 399 DH</p>
                </div>
              </HoverCard>
            </FadeInUp>
          </div>
          
          {/* Navigation avec animation */}
          <FadeInUp delay={0.8}>
            <div className="flex justify-center space-x-4">
              <Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                ← Retour à l'accueil
              </Link>
            </div>
          </FadeInUp>
          
        </div>
      </div>
    </div>
  )
}