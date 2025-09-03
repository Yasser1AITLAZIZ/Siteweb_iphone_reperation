import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  AlertCircle,
  Eye,
  Download,
  Star,
  Filter,
  Search
} from 'lucide-react'
import { TextReveal, FloatingElement, Card3D } from '../components/animations/AppleAnimations'

// Mock data pour les commandes
const mockOrders = [
  {
    id: 'ORD-001',
    date: '2024-12-15',
    status: 'completed',
    type: 'repair',
    items: [
      { name: 'Remplacement écran iPhone 15 Pro', price: 299, quantity: 1 }
    ],
    total: 299,
    estimatedDelivery: '2024-12-16',
    actualDelivery: '2024-12-16',
    tracking: 'TRK-123456789',
    rating: 5,
    review: 'Service excellent, réparation rapide et professionnelle !'
  },
  {
    id: 'ORD-002',
    date: '2024-12-10',
    status: 'in_progress',
    type: 'repair',
    items: [
      { name: 'Remplacement batterie iPhone 14', price: 199, quantity: 1 }
    ],
    total: 199,
    estimatedDelivery: '2024-12-12',
    actualDelivery: null,
    tracking: 'TRK-987654321',
    rating: null,
    review: null
  },
  {
    id: 'ORD-003',
    date: '2024-12-05',
    status: 'shipped',
    type: 'product',
    items: [
      { name: 'Coque iPhone 15 Pro Max', price: 49, quantity: 2 },
      { name: 'Chargeur sans fil MagSafe', price: 79, quantity: 1 }
    ],
    total: 177,
    estimatedDelivery: '2024-12-08',
    actualDelivery: null,
    tracking: 'TRK-456789123',
    rating: null,
    review: null
  }
]

const statusConfig = {
  pending: { label: 'En attente', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock },
  in_progress: { label: 'En cours', color: 'text-blue-600', bg: 'bg-blue-100', icon: Package },
  shipped: { label: 'Expédié', color: 'text-purple-600', bg: 'bg-purple-100', icon: Truck },
  completed: { label: 'Terminé', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle },
  cancelled: { label: 'Annulé', color: 'text-red-600', bg: 'bg-red-100', icon: AlertCircle }
}

export default function Orders() {
  const { user } = useAuth()
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès non autorisé</h1>
          <p className="text-gray-600">Veuillez vous connecter pour accéder à vos commandes</p>
        </div>
      </div>
    )
  }

  const filteredOrders = mockOrders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesStatus && matchesSearch
  })

  const getStatusConfig = (status: keyof typeof statusConfig) => statusConfig[status]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto px-4">
          <TextReveal>
            <div className="text-center text-white">
              <motion.div 
                className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Package size={48} />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Mes Commandes</h1>
              <p className="text-xl opacity-90">Suivez l'état de vos réparations et achats</p>
            </div>
          </TextReveal>
        </div>
      </section>

      {/* Orders Content */}
      <section className="py-16 -mt-10">
        <div className="container mx-auto px-4">
          {/* Filters and Search */}
          <FloatingElement delay={0.1}>
            <Card3D>
              <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 mb-8">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Rechercher une commande..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Filter className="text-gray-600" size={20} />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="pending">En attente</option>
                      <option value="in_progress">En cours</option>
                      <option value="shipped">Expédié</option>
                      <option value="completed">Terminé</option>
                      <option value="cancelled">Annulé</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card3D>
          </FloatingElement>

          {/* Orders List */}
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <FloatingElement key={order.id} delay={index * 0.1}>
                <Card3D>
                  <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Order Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          {(() => {
                            const statusConfig = getStatusConfig(order.status);
                            const IconComponent = statusConfig.icon;
                            return (
                              <div className={`p-3 rounded-full ${statusConfig.bg}`}>
                                <IconComponent 
                                  className={statusConfig.color} 
                                  size={24} 
                                />
                              </div>
                            );
                          })()}
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{order.id}</h3>
                            <p className="text-gray-600">
                              Commandé le {new Date(order.date).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusConfig(order.status).bg} ${getStatusConfig(order.status).color}`}>
                            {getStatusConfig(order.status).label}
                          </span>
                          <span className="text-2xl font-bold text-gray-900">{order.total} DH</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                      <div className="space-y-4">
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Package className="text-blue-600" size={20} />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{item.name}</h4>
                                <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                              </div>
                            </div>
                            <span className="font-semibold text-gray-900">{item.price} DH</span>
                          </div>
                        ))}
                      </div>

                      {/* Order Details */}
                      <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-100">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Informations de livraison</h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p><strong>Numéro de suivi:</strong> {order.tracking}</p>
                            <p><strong>Livraison estimée:</strong> {new Date(order.estimatedDelivery).toLocaleDateString('fr-FR')}</p>
                            {order.actualDelivery && (
                              <p><strong>Livraison effective:</strong> {new Date(order.actualDelivery).toLocaleDateString('fr-FR')}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Actions</h4>
                          <div className="flex flex-wrap gap-3">
                            <motion.button
                              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Eye size={16} />
                              <span>Voir détails</span>
                            </motion.button>
                            
                            <motion.button
                              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Download size={16} />
                              <span>Facture</span>
                            </motion.button>

                            {order.status === 'completed' && !order.rating && (
                              <motion.button
                                className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Star size={16} />
                                <span>Évaluer</span>
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Review Section */}
                      {order.review && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex space-x-1">
                              {[...Array(order.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <span className="text-sm text-blue-600 font-medium">{order.rating}/5</span>
                          </div>
                          <p className="text-gray-700 italic">"{order.review}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card3D>
              </FloatingElement>
            ))}
          </div>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <FloatingElement delay={0.2}>
              <Card3D>
                <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune commande trouvée</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Aucune commande ne correspond à vos critères de recherche'
                      : 'Vous n\'avez pas encore passé de commande'
                    }
                  </p>
                  {!searchTerm && filterStatus === 'all' && (
                    <motion.button
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Découvrir nos services
                    </motion.button>
                  )}
                </div>
              </Card3D>
            </FloatingElement>
          )}
        </div>
      </section>
    </div>
  )
}
