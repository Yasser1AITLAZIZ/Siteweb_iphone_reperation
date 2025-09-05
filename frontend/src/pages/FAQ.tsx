import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, ChevronUp, HelpCircle, Clock, Shield, MapPin, Phone, Star } from 'lucide-react'
import { FadeInUp, HoverCard } from '../components/animations'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  icon: string
  keywords: string[]
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'Combien de temps dure une réparation ?',
    answer: 'La plupart de nos réparations sont effectuées en 30 minutes à 2 heures selon le type de problème. Les réparations complexes peuvent prendre jusqu\'à 24h. Nous vous tiendrons informé de l\'avancement en temps réel.',
    category: 'Réparation',
    icon: '🔧',
    keywords: ['durée', 'temps', 'réparation', 'rapide', '30 minutes']
  },
  {
    id: '2',
    question: 'Quels sont vos tarifs ?',
    answer: 'Nos tarifs commencent à 199 DH pour une batterie, 299 DH pour un écran, et 399 DH pour une caméra. Chaque devis est personnalisé selon votre modèle d\'iPhone et la complexité de la réparation.',
    category: 'Prix',
    icon: '💰',
    keywords: ['tarifs', 'prix', 'devis', 'batterie', 'écran', 'caméra', 'DH']
  },
  {
    id: '3',
    question: 'Quelle garantie offrez-vous ?',
    answer: 'Toutes nos réparations sont garanties 12 mois. Nous utilisons des pièces de qualité OEM et nos techniciens sont certifiés Apple. La garantie couvre les pièces et la main d\'œuvre.',
    category: 'Garantie',
    icon: '🛡️',
    keywords: ['garantie', '12 mois', 'pièces', 'OEM', 'Apple', 'certifié']
  },
  {
    id: '4',
    question: 'Où êtes-vous situés ?',
    answer: 'Notre atelier principal est situé à Casablanca, Maroc. Nous proposons aussi un service de récupération à domicile et d\'envoi par colis pour tout le Maroc.',
    category: 'Localisation',
    icon: '📍',
    keywords: ['localisation', 'Casablanca', 'Maroc', 'domicile', 'colis']
  },
  {
    id: '5',
    question: 'Quels modèles réparez-vous ?',
    answer: 'Nous réparons tous les modèles d\'iPhone, de l\'iPhone 6 à l\'iPhone 15 Pro Max. Nous avons les pièces et l\'expertise pour tous les modèles, même les plus récents.',
    category: 'Modèles',
    icon: '📱',
    keywords: ['modèles', 'iPhone', '6', '15', 'Pro Max', 'pièces']
  },
  {
    id: '6',
    question: 'Quels sont vos horaires ?',
    answer: 'Nous sommes ouverts du lundi au samedi de 9h00 à 19h00, et le dimanche de 10h00 à 18h00. Service d\'urgence disponible sur rendez-vous.',
    category: 'Horaires',
    icon: '⏰',
    keywords: ['horaires', 'ouverture', 'urgence', 'rendez-vous', '9h', '19h']
  },
  {
    id: '7',
    question: 'Comment prendre rendez-vous ?',
    answer: 'Vous pouvez prendre rendez-vous en ligne via notre site, nous appeler au +212 5 22 34 56 78, ou vous présenter directement à notre atelier. Nous acceptons les urgences.',
    category: 'Rendez-vous',
    icon: '📅',
    keywords: ['rendez-vous', 'rdv', 'appel', 'téléphone', 'urgences', 'en ligne']
  },
  {
    id: '8',
    question: 'Acceptez-vous les paiements en ligne ?',
    answer: 'Oui, nous acceptons les paiements par carte bancaire, PayPal, et virement bancaire. Nous proposons aussi des facilités de paiement en plusieurs fois.',
    category: 'Paiement',
    icon: '💳',
    keywords: ['paiement', 'carte', 'PayPal', 'virement', 'facilités', 'fois']
  }
]

const categories = ['Tous', 'Réparation', 'Prix', 'Garantie', 'Localisation', 'Modèles', 'Horaires', 'Rendez-vous', 'Paiement']

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  // Filter FAQ items
  const filteredFAQ = faqData.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'Tous' || item.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header avec animations */}
        <FadeInUp>
          <div className="text-center mb-16">
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl mb-6"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <HelpCircle size={40} className="text-blue-600" />
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
              FAQ iRepair Pro
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Trouvez rapidement les réponses à vos questions sur nos services de réparation iPhone
            </p>
          </div>
        </FadeInUp>

        {/* Barre de recherche moderne */}
        <FadeInUp delay={0.2}>
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans la FAQ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-blue-300 shadow-lg"
              />
            </div>
          </div>
        </FadeInUp>

        {/* Filtres par catégorie */}
        <FadeInUp delay={0.3}>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white/80 text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </FadeInUp>

        {/* Liste des FAQ avec animations */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence>
            {filteredFAQ.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="mb-4"
              >
                <HoverCard>
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <motion.button
                      onClick={() => toggleExpanded(item.id)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors duration-200"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="text-3xl">{item.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                            {item.question}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedItems.includes(item.id) ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-gray-400"
                      >
                        <ChevronDown size={24} />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {expandedItems.includes(item.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                            <p className="text-gray-600 leading-relaxed text-base">
                              {item.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </HoverCard>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Message si aucun résultat */}
          {filteredFAQ.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Aucun résultat trouvé
              </h3>
              <p className="text-gray-500">
                Essayez avec d'autres mots-clés ou contactez-nous directement
              </p>
            </motion.div>
          )}
        </div>

        {/* CTA Section */}
        <FadeInUp delay={0.5}>
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Vous ne trouvez pas votre réponse ?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Notre équipe d'experts est là pour vous aider
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="tel:+212522345678"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-2xl font-semibold hover:bg-gray-100 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Phone size={20} className="mr-2" />
                  +212 5 22 34 56 78
                </motion.a>
                <motion.a
                  href="mailto:contact@irepair-pro.ma"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-2xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="mr-2">✉️</span>
                  Nous écrire
                </motion.a>
              </div>
            </div>
          </div>
        </FadeInUp>
      </div>
    </div>
  )
}