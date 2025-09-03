import React from 'react'
import { Link } from 'react-router-dom'
import { FadeInUp, HoverCard } from '../components/animations'

export default function Contact() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-blue-900 via-purple-900 to-black">
        <div className="container mx-auto px-4 text-center">
          <FadeInUp>
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              Contactez-nous
            </h1>
          </FadeInUp>
          
          <FadeInUp delay={0.3}>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Notre équipe d'experts est là pour vous aider avec toutes vos questions
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-24 bg-white text-black">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <FadeInUp delay={0.2}>
              <HoverCard>
                <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 transition-all duration-500">
                  <div className="text-6xl mb-6">📞</div>
                  <h3 className="text-2xl font-bold mb-4">Téléphone</h3>
                  <p className="text-gray-600 mb-4">Appelez-nous directement</p>
                  <a href="tel:+212522345678" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                    +212 5 22 34 56 78
                  </a>
                  <p className="text-sm text-gray-500 mt-2">Lun-Sam: 9h-19h | Dim: 10h-18h</p>
                </div>
              </HoverCard>
            </FadeInUp>
            
            <FadeInUp delay={0.4}>
              <HoverCard>
                <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-100 hover:from-green-100 hover:to-emerald-200 transition-all duration-500">
                  <div className="text-6xl mb-6">✉️</div>
                  <h3 className="text-2xl font-bold mb-4">Email</h3>
                  <p className="text-gray-600 mb-4">Envoyez-nous un message</p>
                  <a href="mailto:contact@irepair-pro.ma" className="text-xl font-bold text-green-600 hover:text-green-700">
                    contact@irepair-pro.ma
                  </a>
                  <p className="text-sm text-gray-500 mt-2">Réponse sous 24h</p>
                </div>
              </HoverCard>
            </FadeInUp>
            
            <FadeInUp delay={0.6}>
              <HoverCard>
                <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-100 hover:from-purple-100 hover:to-pink-200 transition-all duration-500">
                  <div className="text-6xl mb-6">📍</div>
                  <h3 className="text-2xl font-bold mb-4">Adresse</h3>
                  <p className="text-gray-600 mb-4">Venez nous voir</p>
                  <p className="text-lg font-semibold text-purple-600">
                    123 Boulevard Mohammed V<br />
                    20000 Casablanca, Maroc
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Parking gratuit disponible</p>
                </div>
              </HoverCard>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 bg-gray-900">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <h2 className="text-5xl md:text-6xl font-bold text-center mb-16 text-white">
              Envoyez-nous un message
            </h2>
          </FadeInUp>
          
          <div className="max-w-4xl mx-auto">
            <FadeInUp delay={0.3}>
              <form className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-white text-lg font-semibold mb-3">Nom complet *</label>
                    <input 
                      type="text" 
                      className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all duration-300"
                      placeholder="Votre nom et prénom"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white text-lg font-semibold mb-3">Téléphone *</label>
                    <input 
                      type="tel" 
                      className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all duration-300"
                      placeholder="06 12 34 56 78"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white text-lg font-semibold mb-3">Email *</label>
                  <input 
                    type="email" 
                    className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all duration-300"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-white text-lg font-semibold mb-3">Sujet *</label>
                  <select className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-2xl text-white focus:border-blue-500 focus:outline-none transition-all duration-300">
                    <option value="">Choisissez un sujet</option>
                    <option value="reparation">Demande de réparation</option>
                    <option value="devis">Devis gratuit</option>
                    <option value="rdv">Rendez-vous</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white text-lg font-semibold mb-3">Message *</label>
                  <textarea 
                    rows={6}
                    className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-all duration-300 resize-none"
                    placeholder="Décrivez votre demande..."
                    required
                  ></textarea>
                </div>
                
                <FadeInUp delay={0.6}>
                  <div className="text-center">
                    <button 
                      type="submit"
                      className="px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                    >
                      Envoyer le message
                    </button>
                  </div>
                </FadeInUp>
              </form>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 text-center">
          <FadeInUp delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/" className="px-8 py-4 bg-white text-black rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300">
                ← Retour à l'accueil
              </Link>
              <Link to="/reparations" className="px-8 py-4 border-2 border-white text-white rounded-full text-lg font-semibold hover:bg-white hover:text-black transition-all duration-300">
                🔧 Réparations
              </Link>
              <Link to="/boutique" className="px-8 py-4 border-2 border-white text-white rounded-full text-lg font-semibold hover:bg-white hover:text-black transition-all duration-300">
                🛍️ Boutique
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>
    </div>
  )
}
