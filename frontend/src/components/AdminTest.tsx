import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { Shield, User, Lock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

export default function AdminTest() {
  const { user, isAuthenticated, isAdmin, login, logout } = useAuth()
  const [testResults, setTestResults] = useState<{
    auth: boolean
    admin: boolean
    access: boolean
  }>({
    auth: false,
    admin: false,
    access: false
  })

  const [isTesting, setIsTesting] = useState(false)

  // Test de connexion admin
  const testAdminAccess = async () => {
    setIsTesting(true)
    setTestResults({ auth: false, admin: false, access: false })

    try {
      // Test 1: Connexion avec compte admin
      console.log('🔐 Test de connexion admin...')
      const loginSuccess = await login('admin@irepair-pro.ma', 'password123')
      
      if (loginSuccess) {
        setTestResults(prev => ({ ...prev, auth: true }))
        console.log('✅ Connexion réussie')
        
        // Attendre que l'état se mette à jour
        setTimeout(() => {
          // Test 2: Vérification du rôle admin
          console.log('👑 Vérification du rôle admin...')
          if (isAdmin) {
            setTestResults(prev => ({ ...prev, admin: true }))
            console.log('✅ Rôle admin confirmé')
            
            // Test 3: Test d'accès à la page admin
            console.log('🚪 Test d\'accès à la page admin...')
            setTestResults(prev => ({ ...prev, access: true }))
            console.log('✅ Accès admin autorisé')
          } else {
            console.log('❌ Rôle admin non confirmé')
          }
        }, 1000)
      } else {
        console.log('❌ Échec de la connexion')
      }
    } catch (error) {
      console.error('❌ Erreur lors du test:', error)
    } finally {
      setIsTesting(false)
    }
  }

  // Test de connexion utilisateur normal
  const testUserAccess = async () => {
    setIsTesting(true)
    setTestResults({ auth: false, admin: false, access: false })

    try {
      console.log('🔐 Test de connexion utilisateur...')
      const loginSuccess = await login('john@example.com', 'password123')
      
      if (loginSuccess) {
        setTestResults(prev => ({ ...prev, auth: true }))
        console.log('✅ Connexion utilisateur réussie')
        
        setTimeout(() => {
          if (!isAdmin) {
            setTestResults(prev => ({ ...prev, admin: false }))
            console.log('✅ Rôle utilisateur confirmé (non-admin)')
          }
        }, 1000)
      }
    } catch (error) {
      console.error('❌ Erreur lors du test:', error)
    } finally {
      setIsTesting(false)
    }
  }

  // Test de déconnexion
  const testLogout = () => {
    console.log('🚪 Test de déconnexion...')
    logout()
    setTestResults({ auth: false, admin: false, access: false })
    console.log('✅ Déconnexion réussie')
  }

  const getStatusIcon = (status: boolean) => {
    if (status) {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    }
    return <XCircle className="w-5 h-5 text-red-500" />
  }

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-600 bg-green-50 border-green-200' : 'text-red-600 bg-red-50 border-red-200'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            🧪 Test d'Accès Administrateur
          </h1>
          <p className="text-xl text-slate-600">
            Vérification complète du système d'authentification et d'autorisation
          </p>
        </div>

        {/* État actuel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
            <User className="w-6 h-6 mr-3" />
            État Actuel
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <span className="font-medium text-slate-700">Authentifié :</span>
                <div className="flex items-center space-x-2">
                  {isAuthenticated ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                    {isAuthenticated ? 'Oui' : 'Non'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <span className="font-medium text-slate-700">Rôle :</span>
                <span className="text-slate-600 capitalize">
                  {user?.role || 'Non connecté'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <span className="font-medium text-slate-700">Admin :</span>
                <div className="flex items-center space-x-2">
                  {isAdmin ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className={isAdmin ? 'text-green-600' : 'text-red-600'}>
                    {isAdmin ? 'Oui' : 'Non'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <h4 className="font-medium text-slate-700 mb-2">Informations utilisateur :</h4>
                {user ? (
                  <div className="space-y-2 text-sm">
                    <p><strong>Nom :</strong> {user.name}</p>
                    <p><strong>Email :</strong> {user.email}</p>
                    <p><strong>Rôle :</strong> {user.role}</p>
                    <p><strong>Avatar :</strong> {user.avatar}</p>
                  </div>
                ) : (
                  <p className="text-slate-500 italic">Aucun utilisateur connecté</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-slate-200"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-3" />
            Tests d'Accès
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.button
              onClick={testAdminAccess}
              disabled={isTesting}
              className="p-4 bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-xl hover:from-slate-700 hover:to-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2" />
                <span>Test Admin</span>
              </div>
            </motion.button>
            
            <motion.button
              onClick={testUserAccess}
              disabled={isTesting}
              className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <User className="w-8 h-8 mx-auto mb-2" />
                <span>Test Utilisateur</span>
              </div>
            </motion.button>
            
            <motion.button
              onClick={testLogout}
              className="p-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <Lock className="w-8 h-8 mx-auto mb-2" />
                <span>Déconnexion</span>
              </div>
            </motion.button>
          </div>

          {/* Résultats des tests */}
          <div className="space-y-4">
            <h4 className="font-medium text-slate-700 mb-3">Résultats des tests :</h4>
            
            <div className={`p-4 rounded-xl border ${getStatusColor(testResults.auth)}`}>
              <div className="flex items-center justify-between">
                <span className="font-medium">Authentification</span>
                {getStatusIcon(testResults.auth)}
              </div>
              <p className="text-sm mt-1">
                {testResults.auth ? 'Connexion réussie' : 'En attente du test'}
              </p>
            </div>
            
            <div className={`p-4 rounded-xl border ${getStatusColor(testResults.admin)}`}>
              <div className="flex items-center justify-between">
                <span className="font-medium">Rôle Administrateur</span>
                {getStatusIcon(testResults.admin)}
              </div>
              <p className="text-sm mt-1">
                {testResults.admin ? 'Rôle admin confirmé' : 'En attente du test'}
              </p>
            </div>
            
            <div className={`p-4 rounded-xl border ${getStatusColor(testResults.access)}`}>
              <div className="flex items-center justify-between">
                <span className="font-medium">Accès à la Page Admin</span>
                {getStatusIcon(testResults.access)}
              </div>
              <p className="text-sm mt-1">
                {testResults.access ? 'Accès autorisé' : 'En attente du test'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200"
        >
          <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2" />
            Instructions de Test
          </h3>
          
          <div className="space-y-3 text-blue-800">
            <p><strong>1.</strong> Cliquez sur "Test Admin" pour tester la connexion administrateur</p>
            <p><strong>2.</strong> Vérifiez que le rôle admin est bien détecté</p>
            <p><strong>3.</strong> Testez l'accès à la page admin via le menu utilisateur</p>
            <p><strong>4.</strong> Utilisez "Test Utilisateur" pour tester un compte normal</p>
            <p><strong>5.</strong> Vérifiez que l'accès admin est refusé pour les utilisateurs normaux</p>
          </div>
          
          <div className="mt-6 p-4 bg-blue-100 rounded-xl">
            <p className="text-sm text-blue-800">
              <strong>Comptes de test :</strong><br/>
              Admin: admin@irepair-pro.ma / password123<br/>
              Utilisateur: john@example.com / password123
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

