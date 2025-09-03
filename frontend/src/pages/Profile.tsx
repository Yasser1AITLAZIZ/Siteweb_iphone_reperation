import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Save, 
  X, 
  Shield, 
  CreditCard,
  Settings,
  Bell,
  Camera
} from 'lucide-react'
import { TextReveal, FloatingElement, Card3D } from '../components/animations/AppleAnimations'

export default function Profile() {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '123 Rue Mohammed V, Casablanca, Maroc',
    city: 'Casablanca',
    postalCode: '20000'
  })

  const handleSave = () => {
    // Ici on pourrait appeler une API pour sauvegarder
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: '123 Rue Mohammed V, Casablanca, Maroc',
      city: 'Casablanca',
      postalCode: '20000'
    })
    setIsEditing(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600">Veuillez vous connecter pour accéder à votre profil</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <TextReveal>
            <div className="text-center text-white">
              <motion.div 
                className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <User size={48} />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Mon Profil</h1>
              <p className="text-xl opacity-90">Gérez vos informations personnelles et préférences</p>
            </div>
          </TextReveal>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-16 -mt-10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
              <FloatingElement delay={0.1}>
                <Card3D>
                  <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                    <div className="text-center mb-8">
                      <div className="relative inline-block">
                        <motion.div 
                          className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4"
                          whileHover={{ scale: 1.05 }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </motion.div>
                        <motion.button
                          className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Camera size={20} />
                        </motion.button>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
                      <p className="text-gray-600">{user.email}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Shield className="text-blue-600" size={20} />
                        <div>
                          <p className="font-medium text-gray-900">Membre depuis</p>
                          <p className="text-sm text-gray-600">Décembre 2024</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <CreditCard className="text-green-600" size={20} />
                        <div>
                          <p className="font-medium text-gray-900">Statut</p>
                          <p className="text-sm text-green-600">Vérifié ✓</p>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      onClick={logout}
                      className="w-full mt-6 py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Se déconnecter
                    </motion.button>
                  </div>
                </Card3D>
              </FloatingElement>
            </div>

            {/* Right Column - Profile Details */}
            <div className="lg:col-span-2">
              <FloatingElement delay={0.2}>
                <Card3D>
                  <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-bold text-gray-900">Informations personnelles</h3>
                      {!isEditing ? (
                        <motion.button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Edit3 size={20} />
                          <span>Modifier</span>
                        </motion.button>
                      ) : (
                        <div className="flex space-x-3">
                          <motion.button
                            onClick={handleSave}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Save size={20} />
                            <span>Sauvegarder</span>
                          </motion.button>
                          <motion.button
                            onClick={handleCancel}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <X size={20} />
                            <span>Annuler</span>
                          </motion.button>
                        </div>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom complet
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <User className="text-blue-600" size={20} />
                            <span className="text-gray-900">{user.name}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={editData.email}
                            onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <Mail className="text-blue-600" size={20} />
                            <span className="text-gray-900">{user.email}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editData.phone}
                            onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <Phone className="text-blue-600" size={20} />
                            <span className="text-gray-900">{user.phone}</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ville
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.city}
                            onChange={(e) => setEditData(prev => ({ ...prev, city: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <MapPin className="text-blue-600" size={20} />
                            <span className="text-gray-900">{editData.city}</span>
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adresse complète
                        </label>
                        {isEditing ? (
                          <textarea
                            value={editData.address}
                            onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <MapPin className="text-blue-600 mt-1" size={20} />
                            <span className="text-gray-900">{editData.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card3D>
              </FloatingElement>

              {/* Preferences Section */}
              <FloatingElement delay={0.3}>
                <Card3D>
                  <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 mt-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Préférences</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Bell className="text-blue-600" size={20} />
                          <div>
                            <p className="font-medium text-gray-900">Notifications email</p>
                            <p className="text-sm text-gray-600">Recevoir des mises à jour</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Settings className="text-purple-600" size={20} />
                          <div>
                            <p className="font-medium text-gray-900">Mode sombre</p>
                            <p className="text-sm text-gray-600">Interface sombre</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </Card3D>
              </FloatingElement>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
