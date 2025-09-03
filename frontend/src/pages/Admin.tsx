import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { TextReveal, FloatingElement, Card3D } from '../components/animations/AppleAnimations'

// Mock data pour l'admin
const mockStats = {
  totalRevenue: 125000,
  totalOrders: 1250,
  totalCustomers: 890,
  totalRepairs: 980,
  revenueGrowth: 12.5,
  ordersGrowth: 8.3,
  customersGrowth: 15.2,
  repairsGrowth: 22.1
}

const mockRecentOrders = [
  {
    id: 'ORD-001',
    customer: 'Ahmed Benali',
    service: 'Remplacement écran iPhone 15 Pro',
    amount: 299,
    status: 'completed',
    date: '2024-12-15',
    time: '14:30'
  },
  {
    id: 'ORD-002',
    customer: 'Fatima Zahra',
    service: 'Remplacement batterie iPhone 14',
    amount: 199,
    status: 'in_progress',
    date: '2024-12-15',
    time: '13:15'
  },
  {
    id: 'ORD-003',
    customer: 'Youssef Alami',
    service: 'Réparation caméra iPhone 13',
    amount: 399,
    status: 'pending',
    date: '2024-12-15',
    time: '12:45'
  }
]

const mockTopServices = [
  { name: 'Remplacement écran', count: 245, revenue: 73255, growth: 15.3 },
  { name: 'Remplacement batterie', count: 189, revenue: 37611, growth: 8.7 },
  { name: 'Réparation caméra', count: 156, revenue: 62244, growth: 22.1 },
  { name: 'Remplacement chargeur', count: 134, revenue: 20100, growth: 12.5 }
]

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusConfig = (status: string) => {
    const configs = {
      completed: { label: 'Terminé', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle },
      in_progress: { label: 'En cours', color: 'text-blue-600', bg: 'bg-blue-100', icon: Clock },
      pending: { label: 'En attente', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: AlertCircle }
    }
    return configs[status as keyof typeof configs] || configs.pending
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD'
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="container mx-auto px-4">
          <TextReveal>
            <div className="text-center text-white">
              <motion.div 
                className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <BarChart3 size={48} />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Administration</h1>
              <p className="text-xl opacity-90">Tableau de bord et gestion complète</p>
            </div>
          </TextReveal>
        </div>
      </section>

      {/* Admin Content */}
      <section className="py-16 -mt-10">
        <div className="container mx-auto px-4">
          {/* Navigation Tabs */}
          <FloatingElement delay={0.1}>
            <Card3D>
              <div className="bg-white rounded-3xl shadow-xl p-2 border border-gray-100 mb-8">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
                    { id: 'orders', label: 'Commandes', icon: Package },
                    { id: 'customers', label: 'Clients', icon: Users },
                    { id: 'analytics', label: 'Analyses', icon: TrendingUp },
                    { id: 'settings', label: 'Paramètres', icon: Settings }
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <tab.icon size={20} />
                      <span>{tab.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </Card3D>
          </FloatingElement>

          {/* Dashboard Content */}
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <FloatingElement delay={0.2}>
                  <Card3D>
                    <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Revenus totaux</p>
                          <p className="text-3xl font-bold text-gray-900">{formatCurrency(mockStats.totalRevenue)}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                          <DollarSign className="text-green-600" size={24} />
                        </div>
                      </div>
                      <div className="flex items-center mt-4">
                        <ArrowUpRight className="text-green-600" size={16} />
                        <span className="text-sm font-medium text-green-600 ml-1">+{mockStats.revenueGrowth}%</span>
                        <span className="text-sm text-gray-600 ml-2">vs mois dernier</span>
                      </div>
                    </div>
                  </Card3D>
                </FloatingElement>

                <FloatingElement delay={0.3}>
                  <Card3D>
                    <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Commandes</p>
                          <p className="text-3xl font-bold text-gray-900">{mockStats.totalOrders}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                          <Package className="text-blue-600" size={24} />
                        </div>
                      </div>
                      <div className="flex items-center mt-4">
                        <ArrowUpRight className="text-green-600" size={16} />
                        <span className="text-sm font-medium text-green-600 ml-1">+{mockStats.ordersGrowth}%</span>
                        <span className="text-sm text-gray-600 ml-2">vs mois dernier</span>
                      </div>
                    </div>
                  </Card3D>
                </FloatingElement>

                <FloatingElement delay={0.4}>
                  <Card3D>
                    <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Clients</p>
                          <p className="text-3xl font-bold text-gray-900">{mockStats.totalCustomers}</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                          <Users className="text-purple-600" size={24} />
                        </div>
                      </div>
                      <div className="flex items-center mt-4">
                        <ArrowUpRight className="text-green-600" size={16} />
                        <span className="text-sm font-medium text-green-600 ml-1">+{mockStats.customersGrowth}%</span>
                        <span className="text-sm text-gray-600 ml-2">vs mois dernier</span>
                      </div>
                    </div>
                  </Card3D>
                </FloatingElement>

                <FloatingElement delay={0.5}>
                  <Card3D>
                    <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Réparations</p>
                          <p className="text-3xl font-bold text-gray-900">{mockStats.totalRepairs}</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                          <Package className="text-orange-600" size={24} />
                        </div>
                      </div>
                      <div className="flex items-center mt-4">
                        <ArrowUpRight className="text-green-600" size={16} />
                        <span className="text-sm font-medium text-green-600 ml-1">+{mockStats.repairsGrowth}%</span>
                        <span className="text-sm text-gray-600 ml-2">vs mois dernier</span>
                      </div>
                    </div>
                  </Card3D>
                </FloatingElement>
              </div>

              {/* Charts and Analytics */}
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* Recent Orders */}
                <FloatingElement delay={0.6}>
                  <Card3D>
                    <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Commandes récentes</h3>
                        <motion.button
                          className="text-blue-600 hover:text-blue-700 font-medium"
                          whileHover={{ scale: 1.05 }}
                        >
                          Voir tout
                        </motion.button>
                      </div>
                      
                      <div className="space-y-4">
                        {mockRecentOrders.map((order, index) => {
                          const statusConfig = getStatusConfig(order.status)
                          return (
                            <motion.div
                              key={order.id}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="flex items-center space-x-4">
                                <div className={`p-2 rounded-full ${statusConfig.bg}`}>
                                  <statusConfig.icon className={statusConfig.color} size={16} />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{order.customer}</p>
                                  <p className="text-sm text-gray-600">{order.service}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">{formatCurrency(order.amount)}</p>
                                <p className="text-sm text-gray-600">{order.date} {order.time}</p>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>
                  </Card3D>
                </FloatingElement>

                {/* Top Services */}
                <FloatingElement delay={0.7}>
                  <Card3D>
                    <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Services populaires</h3>
                      
                      <div className="space-y-4">
                        {mockTopServices.map((service, index) => (
                          <motion.div
                            key={service.name}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{service.name}</p>
                                <p className="text-sm text-gray-600">{service.count} commandes</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">{formatCurrency(service.revenue)}</p>
                              <div className="flex items-center">
                                <ArrowUpRight className="text-green-600" size={14} />
                                <span className="text-sm text-green-600 ml-1">+{service.growth}%</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </Card3D>
                </FloatingElement>
              </div>

              {/* Quick Actions */}
              <FloatingElement delay={0.8}>
                <Card3D>
                  <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Actions rapides</h3>
                    
                    <div className="grid md:grid-cols-4 gap-4">
                      <motion.button
                        className="flex flex-col items-center p-6 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus className="text-blue-600 mb-2" size={24} />
                        <span className="text-sm font-medium text-blue-900">Nouvelle commande</span>
                      </motion.button>

                      <motion.button
                        className="flex flex-col items-center p-6 bg-green-50 rounded-2xl hover:bg-green-100 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Users className="text-green-600 mb-2" size={24} />
                        <span className="text-sm font-medium text-green-900">Ajouter client</span>
                      </motion.button>

                      <motion.button
                        className="flex flex-col items-center p-6 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <BarChart3 className="text-purple-600 mb-2" size={24} />
                        <span className="text-sm font-medium text-purple-900">Générer rapport</span>
                      </motion.button>

                      <motion.button
                        className="flex flex-col items-center p-6 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Settings className="text-orange-600 mb-2" size={24} />
                        <span className="text-sm font-medium text-orange-900">Paramètres</span>
                      </motion.button>
                    </div>
                  </div>
                </Card3D>
              </FloatingElement>
            </>
          )}

          {/* Other tabs content would go here */}
          {activeTab !== 'dashboard' && (
            <FloatingElement delay={0.2}>
              <Card3D>
                <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Fonctionnalité en développement</h3>
                  <p className="text-gray-600">
                    Le contenu pour l'onglet "{activeTab}" sera bientôt disponible
                  </p>
                </div>
              </Card3D>
            </FloatingElement>
          )}
        </div>
      </section>
    </div>
  )
}
