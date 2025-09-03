import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, Calculator, HelpCircle, Shield, Phone, Search, Sparkles, Zap, Star, TrendingUp } from 'lucide-react'

// Types
interface RepairEstimate {
  model: string
  issue: string
  symptoms: string[]
  priceRange: string
  duration: string
}

interface FAQItem {
  question: string
  answer: string
  keywords: string[]
}

// Mock data
const phoneModels = [
  'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
  'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
  'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 13 mini',
  'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 12 mini'
]

const commonIssues = [
  'Écran cassé', 'Batterie défaillante', 'Caméra défaillante', 'Haut-parleur',
  'Microphone', 'Bouton home', 'Chargeur', 'Autre'
]

const symptoms = [
  'Écran noir', 'Écran cassé', 'Batterie se décharge vite', 'Ne charge plus',
  'Caméra floue', 'Son cassé', 'Ne s\'allume plus', 'Lent'
]

const faqData: FAQItem[] = [
  {
    question: "Combien de temps dure une réparation ?",
    answer: "La plupart de nos réparations sont effectuées en moins de 30 minutes. Certaines réparations complexes peuvent prendre jusqu'à 2 heures.",
    keywords: ["durée", "temps", "réparation", "rapide"]
  },
  {
    question: "Quelle est la garantie sur vos réparations ?",
    answer: "Toutes nos réparations bénéficient d'une garantie de 12 mois sur les pièces et la main d'œuvre.",
    keywords: ["garantie", "12 mois", "pièces", "main d'œuvre"]
  },
  {
    question: "Utilisez-vous des pièces d'origine ?",
    answer: "Oui, nous utilisons exclusivement des pièces OEM (Original Equipment Manufacturer) de qualité Apple.",
    keywords: ["pièces", "origine", "OEM", "Apple", "qualité"]
  },
  {
    question: "Puis-je prendre rendez-vous ?",
    answer: "Oui, vous pouvez prendre rendez-vous en ligne ou nous appeler au +212 5 22 34 56 78.",
    keywords: ["rendez-vous", "rdv", "appel", "téléphone"]
  }
]

const policies = [
  "Garantie 12 mois sur toutes les réparations",
  "Pièces OEM garanties",
  "Service client disponible 7j/7",
  "Devis gratuit et sans engagement",
  "Réparation express en 30 minutes"
]

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'estimate' | 'faq' | 'guarantees'>('estimate')
  const [estimate, setEstimate] = useState<RepairEstimate>({
    model: '',
    issue: '',
    symptoms: [],
    priceRange: '',
    duration: ''
  })
  const [faqSearch, setFaqSearch] = useState('')
  const [showContactDialog, setShowContactDialog] = useState(false)

  // Calculate estimate
  const calculateEstimate = () => {
    if (!estimate.model || !estimate.issue) return

    let basePrice = 0
    let baseDuration = ''

    // Base pricing logic
    if (estimate.issue === 'Écran cassé') {
      basePrice = 299
      baseDuration = '30 minutes'
    } else if (estimate.issue === 'Batterie défaillante') {
      basePrice = 199
      baseDuration = '45 minutes'
    } else if (estimate.issue === 'Caméra défaillante') {
      basePrice = 399
      baseDuration = '1 heure'
    } else {
      basePrice = 250
      baseDuration = '45 minutes'
    }

    // Model adjustment (newer models = higher price)
    if (estimate.model.includes('15')) basePrice += 100
    if (estimate.model.includes('14')) basePrice += 50

    const priceRange = `${basePrice} - ${basePrice + 100} DH`

    setEstimate(prev => ({
      ...prev,
      priceRange,
      duration: baseDuration
    }))
  }

  // Filter FAQ by search
  const filteredFAQ = faqData.filter(item =>
    item.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
    item.keywords.some(keyword => keyword.toLowerCase().includes(faqSearch.toLowerCase()))
  )

  // Toggle symptom
  const toggleSymptom = (symptom: string) => {
    setEstimate(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }))
  }

  return (
    <>
      {/* Floating Button - Ultra moderne */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 z-50 flex items-center justify-center group"
        whileHover={{
          scale: 1.1,
          rotate: 5,
          boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.4)"
        }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0 25px 50px -12px rgba(59, 130, 246, 0.4)",
            "0 25px 50px -12px rgba(147, 51, 234, 0.4)",
            "0 25px 50px -12px rgba(59, 130, 246, 0.4)"
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="relative">
          <MessageCircle size={28} className="group-hover:scale-110 transition-transform duration-300" />
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Pulse effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>

      {/* Chatbot Panel - Design ultra moderne */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-32 right-8 w-96 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 z-50 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
              backdropFilter: 'blur(20px)'
            }}
          >
            {/* Header avec gradient moderne */}
            <div className="relative overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 relative">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Sparkles size={20} className="text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Assistant iRepair Pro</h3>
                      <p className="text-white/80 text-sm">Expert en réparation iPhone</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={18} />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Tabs avec design moderne */}
            <div className="flex bg-gray-50/50 p-2">
              {[
                { id: 'estimate', label: 'Estimation', icon: Calculator, color: 'from-blue-500 to-blue-600' },
                { id: 'faq', label: 'FAQ', icon: HelpCircle, color: 'from-purple-500 to-purple-600' },
                { id: 'guarantees', label: 'Garanties', icon: Shield, color: 'from-green-500 to-green-600' }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-300 rounded-2xl relative overflow-hidden ${
                    activeTab === tab.id
                      ? 'text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-2xl`}
                      layoutId="activeTab"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center justify-center space-x-2">
                    <tab.icon size={16} />
                    <span>{tab.label}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Content avec scroll élégant */}
            <div className="p-6 max-h-96 overflow-y-auto custom-scrollbar">
              {/* Estimation Tab */}
              {activeTab === 'estimate' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-3"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                    >
                      <Calculator className="text-blue-600" size={28} />
                    </motion.div>
                    <h4 className="text-lg font-bold text-gray-900">Estimation de réparation</h4>
                    <p className="text-gray-600 text-sm">Obtenez un devis instantané</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <Zap size={16} className="mr-2 text-blue-500" />
                        Modèle iPhone
                      </label>
                      <select
                        value={estimate.model}
                        onChange={(e) => setEstimate(prev => ({ ...prev, model: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-blue-300"
                      >
                        <option value="">Sélectionnez un modèle</option>
                        {phoneModels.map(model => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <TrendingUp size={16} className="mr-2 text-purple-500" />
                        Type de panne
                      </label>
                      <select
                        value={estimate.issue}
                        onChange={(e) => setEstimate(prev => ({ ...prev, issue: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300 hover:border-purple-300"
                      >
                        <option value="">Sélectionnez la panne</option>
                        {commonIssues.map(issue => (
                          <option key={issue} value={issue}>{issue}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <Star size={16} className="mr-2 text-yellow-500" />
                        Symptômes (optionnel)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {symptoms.map(symptom => (
                          <motion.label
                            key={symptom}
                            className="flex items-center space-x-2 p-2 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
                            whileHover={{ scale: 1.02 }}
                          >
                            <input
                              type="checkbox"
                              checked={estimate.symptoms.includes(symptom)}
                              onChange={() => toggleSymptom(symptom)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{symptom}</span>
                          </motion.label>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      onClick={calculateEstimate}
                      disabled={!estimate.model || !estimate.issue}
                      className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      ✨ Estimer le prix
                    </motion.button>

                    {estimate.priceRange && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl border border-blue-200"
                      >
                        <h4 className="font-bold text-blue-900 mb-3 flex items-center">
                          <Sparkles size={16} className="mr-2" />
                          Estimation
                        </h4>
                        <div className="space-y-2 text-blue-800">
                          <p><strong>Prix :</strong> {estimate.priceRange}</p>
                          <p><strong>Durée :</strong> {estimate.duration}</p>
                        </div>
                        <p className="text-xs text-blue-600 mt-3 italic">
                          * Estimation basée sur les informations fournies. Prix final après diagnostic.
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* FAQ Tab */}
              {activeTab === 'faq' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-6">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-3"
                      whileHover={{ scale: 1.05, rotate: -5 }}
                    >
                      <HelpCircle className="text-purple-600" size={28} />
                    </motion.div>
                    <h4 className="text-lg font-bold text-gray-900">Questions fréquentes</h4>
                    <p className="text-gray-600 text-sm">Trouvez rapidement vos réponses</p>
                  </div>

                  <div className="relative mb-4">
                    <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher dans la FAQ..."
                      value={faqSearch}
                      onChange={(e) => setFaqSearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-3">
                    {filteredFAQ.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 rounded-2xl p-4 hover:border-purple-300 hover:shadow-md transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      >
                        <h4 className="font-semibold text-gray-900 mb-2">{item.question}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Guarantees Tab */}
              {activeTab === 'guarantees' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-6">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-3"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                    >
                      <Shield className="text-green-600" size={28} />
                    </motion.div>
                    <h4 className="text-lg font-bold text-gray-900">Nos Garanties</h4>
                    <p className="text-gray-600 text-sm">Votre tranquillité d'esprit</p>
                  </div>

                  <div className="space-y-3">
                    {policies.map((policy, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3 p-3 bg-green-50 rounded-2xl border border-green-200"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-green-800 font-medium">{policy}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer avec CTA moderne */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
              <motion.button
                onClick={() => setShowContactDialog(true)}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Phone size={18} />
                <span>Parler à un conseiller</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Dialog - Design ultra moderne */}
      <AnimatePresence>
        {showContactDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowContactDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  <Phone size={36} className="text-green-600" />
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Contactez un conseiller
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Notre équipe d'experts est disponible pour vous aider avec toutes vos questions et vous accompagner dans vos réparations
                </p>

                <div className="space-y-4">
                  <motion.a
                    href="tel:+212522345678"
                    className="block w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-2xl">📞</span>
                    <span>+212 5 22 34 56 78</span>
                  </motion.a>

                  <motion.a
                    href="mailto:contact@irepair-pro.ma"
                    className="block w-full py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 font-semibold flex items-center justify-center space-x-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-2xl">✉️</span>
                    <span>contact@irepair-pro.ma</span>
                  </motion.a>
                </div>

                <motion.button
                  onClick={() => setShowContactDialog(false)}
                  className="mt-6 text-gray-500 hover:text-gray-700 transition-colors font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  Fermer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS pour le scrollbar personnalisé */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
      `}</style>
    </>
  )
}