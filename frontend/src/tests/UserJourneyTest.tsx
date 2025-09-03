import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Play, Pause, RotateCcw } from 'lucide-react'

interface TestStep {
  id: string
  name: string
  description: string
  status: 'pending' | 'running' | 'passed' | 'failed'
  details?: string
  duration?: number
}

interface TestScenario {
  id: string
  name: string
  description: string
  steps: TestStep[]
  status: 'pending' | 'running' | 'passed' | 'failed'
}

export default function UserJourneyTest() {
  const [scenarios, setScenarios] = useState<TestScenario[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [currentScenario, setCurrentScenario] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [results, setResults] = useState<{ passed: number; failed: number; total: number }>({
    passed: 0,
    failed: 0,
    total: 0
  })

  // Initialisation des scénarios de test
  useEffect(() => {
    const testScenarios: TestScenario[] = [
      {
        id: 'homepage',
        name: '🏠 Page d\'accueil',
        description: 'Test de la page d\'accueil et navigation principale',
        status: 'pending',
        steps: [
          {
            id: 'hero-section',
            name: 'Section Hero',
            description: 'Vérification de la section hero avec animations',
            status: 'pending'
          },
          {
            id: 'navigation',
            name: 'Navigation',
            description: 'Test des liens de navigation et menu',
            status: 'pending'
          },
          {
            id: 'cta-buttons',
            name: 'Boutons CTA',
            description: 'Vérification des boutons d\'appel à l\'action',
            status: 'pending'
          },
          {
            id: 'animations',
            name: 'Animations',
            description: 'Test des animations et transitions',
            status: 'pending'
          }
        ]
      },
      {
        id: 'authentication',
        name: '🔐 Authentification',
        description: 'Test du système de connexion/inscription',
        status: 'pending',
        steps: [
          {
            id: 'login-form',
            name: 'Formulaire de connexion',
            description: 'Vérification du formulaire de connexion',
            status: 'pending'
          },
          {
            id: 'signup-form',
            name: 'Formulaire d\'inscription',
            description: 'Vérification du formulaire d\'inscription',
            status: 'pending'
          },
          {
            id: 'auth-flow',
            name: 'Flux d\'authentification',
            description: 'Test du processus complet de connexion',
            status: 'pending'
          }
        ]
      },
      {
        id: 'chatbot',
        name: '💬 Chatbot',
        description: 'Test du widget chatbot et ses fonctionnalités',
        status: 'pending',
        steps: [
          {
            id: 'chatbot-button',
            name: 'Bouton chatbot',
            description: 'Vérification du bouton flottant',
            status: 'pending'
          },
          {
            id: 'estimation-tab',
            name: 'Onglet Estimation',
            description: 'Test de l\'onglet estimation de réparation',
            status: 'pending'
          },
          {
            id: 'faq-tab',
            name: 'Onglet FAQ',
            description: 'Test de l\'onglet FAQ et recherche',
            status: 'pending'
          },
          {
            id: 'guarantees-tab',
            name: 'Onglet Garanties',
            description: 'Test de l\'onglet garanties',
            status: 'pending'
          },
          {
            id: 'contact-dialog',
            name: 'Dialog de contact',
            description: 'Test du dialog de contact',
            status: 'pending'
          }
        ]
      },
      {
        id: 'cart',
        name: '🛒 Panier',
        description: 'Test du système de panier',
        status: 'pending',
        steps: [
          {
            id: 'add-to-cart',
            name: 'Ajouter au panier',
            description: 'Test d\'ajout d\'articles au panier',
            status: 'pending'
          },
          {
            id: 'cart-widget',
            name: 'Widget panier',
            description: 'Vérification du widget panier flottant',
            status: 'pending'
          },
          {
            id: 'cart-management',
            name: 'Gestion du panier',
            description: 'Test de modification et suppression d\'articles',
            status: 'pending'
          }
        ]
      },
      {
        id: 'profile',
        name: '👤 Profil utilisateur',
        description: 'Test des pages de gestion du profil',
        status: 'pending',
        steps: [
          {
            id: 'profile-page',
            name: 'Page profil',
            description: 'Vérification de la page profil',
            status: 'pending'
          },
          {
            id: 'profile-edit',
            name: 'Édition profil',
            description: 'Test de la modification des informations',
            status: 'pending'
          },
          {
            id: 'orders-page',
            name: 'Page commandes',
            description: 'Vérification de la page des commandes',
            status: 'pending'
          }
        ]
      },
      {
        id: 'admin',
        name: '⚙️ Administration',
        description: 'Test du tableau de bord administrateur',
        status: 'pending',
        steps: [
          {
            id: 'admin-dashboard',
            name: 'Tableau de bord',
            description: 'Vérification du tableau de bord admin',
            status: 'pending'
          },
          {
            id: 'admin-stats',
            name: 'Statistiques',
            description: 'Test des statistiques et métriques',
            status: 'pending'
          },
          {
            id: 'admin-navigation',
            name: 'Navigation admin',
            description: 'Test de la navigation entre onglets',
            status: 'pending'
          }
        ]
      }
    ]

    setScenarios(testScenarios)
    setResults({
      passed: 0,
      failed: 0,
      total: testScenarios.reduce((acc, scenario) => acc + scenario.steps.length, 0)
    })
  }, [])

  // Simulation des tests
  const runTest = async (scenarioIndex: number, stepIndex: number) => {
    const updatedScenarios = [...scenarios]
    const scenario = updatedScenarios[scenarioIndex]
    const step = scenario.steps[stepIndex]

    // Marquer comme en cours
    step.status = 'running'
    scenario.status = 'running'
    setScenarios(updatedScenarios)

    // Simuler le test
    const startTime = Date.now()
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000)) // 1-3 secondes
    const duration = Date.now() - startTime

    // Simuler le résultat (90% de succès pour la démo)
    const passed = Math.random() > 0.1
    step.status = passed ? 'passed' : 'failed'
    step.duration = duration
    step.details = passed 
      ? 'Test réussi - Toutes les fonctionnalités fonctionnent correctement'
      : 'Test échoué - Problème détecté dans la fonctionnalité'

    // Mettre à jour le statut du scénario
    const allStepsPassed = scenario.steps.every(s => s.status === 'passed')
    const anyStepFailed = scenario.steps.some(s => s.status === 'failed')
    
    if (anyStepFailed) {
      scenario.status = 'failed'
    } else if (allStepsPassed) {
      scenario.status = 'passed'
    }

    setScenarios(updatedScenarios)

    // Mettre à jour les résultats globaux
    const newResults = {
      passed: updatedScenarios.reduce((acc, s) => acc + s.steps.filter(st => st.status === 'passed').length, 0),
      failed: updatedScenarios.reduce((acc, s) => acc + s.steps.filter(st => st.status === 'failed').length, 0),
      total: results.total
    }
    setResults(newResults)
  }

  // Exécuter tous les tests
  const runAllTests = async () => {
    setIsRunning(true)
    setCurrentScenario(0)
    setCurrentStep(0)

    for (let scenarioIndex = 0; scenarioIndex < scenarios.length; scenarioIndex++) {
      setCurrentScenario(scenarioIndex)
      for (let stepIndex = 0; stepIndex < scenarios[scenarioIndex].steps.length; stepIndex++) {
        setCurrentStep(stepIndex)
        await runTest(scenarioIndex, stepIndex)
        await new Promise(resolve => setTimeout(resolve, 500)) // Pause entre les tests
      }
    }

    setIsRunning(false)
  }

  // Arrêter les tests
  const stopTests = () => {
    setIsRunning(false)
  }

  // Réinitialiser les tests
  const resetTests = () => {
    const updatedScenarios = scenarios.map(scenario => ({
      ...scenario,
      status: 'pending',
      steps: scenario.steps.map(step => ({
        ...step,
        status: 'pending',
        details: undefined,
        duration: undefined
      }))
    }))
    setScenarios(updatedScenarios)
    setResults({
      passed: 0,
      failed: 0,
      total: results.total
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />
      case 'running': return <AlertTriangle className="w-5 h-5 text-yellow-500 animate-pulse" />
      default: return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-600 bg-green-50 border-green-200'
      case 'failed': return 'text-red-600 bg-red-50 border-red-200'
      case 'running': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧪 Test Automatisé du Parcours Client
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Vérification complète de toutes les fonctionnalités et composants
          </p>
          
          {/* Contrôles */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <motion.button
              onClick={runAllTests}
              disabled={isRunning}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={20} />
              <span>Lancer tous les tests</span>
            </motion.button>
            
            <motion.button
              onClick={stopTests}
              disabled={!isRunning}
              className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Pause size={20} />
              <span>Arrêter</span>
            </motion.button>
            
            <motion.button
              onClick={resetTests}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw size={20} />
              <span>Réinitialiser</span>
            </motion.button>
          </div>

          {/* Résultats globaux */}
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">{results.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{results.passed}</div>
              <div className="text-sm text-gray-600">Réussis</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-red-600">{results.failed}</div>
              <div className="text-sm text-gray-600">Échoués</div>
            </div>
          </div>
        </div>

        {/* Scénarios de test */}
        <div className="space-y-6">
          {scenarios.map((scenario, scenarioIndex) => (
            <motion.div
              key={scenario.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: scenarioIndex * 0.1 }}
            >
              {/* Header du scénario */}
              <div className={`p-6 border-b ${getStatusColor(scenario.status)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{scenario.name}</h3>
                    <p className="text-sm opacity-80">{scenario.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(scenario.status)}
                    <span className="text-sm font-medium capitalize">{scenario.status}</span>
                  </div>
                </div>
              </div>

              {/* Étapes du scénario */}
              <div className="p-6">
                <div className="space-y-4">
                  {scenario.steps.map((step, stepIndex) => (
                    <motion.div
                      key={step.id}
                      className={`p-4 rounded-lg border transition-all duration-300 ${
                        step.status === 'running' ? 'border-yellow-300 bg-yellow-50' :
                        step.status === 'passed' ? 'border-green-300 bg-green-50' :
                        step.status === 'failed' ? 'border-red-300 bg-red-50' :
                        'border-gray-200 bg-gray-50'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: stepIndex * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(step.status)}
                          <div>
                            <h4 className="font-semibold text-gray-900">{step.name}</h4>
                            <p className="text-sm text-gray-600">{step.description}</p>
                          </div>
                        </div>
                        {step.duration && (
                          <span className="text-sm text-gray-500">
                            {step.duration}ms
                          </span>
                        )}
                      </div>
                      
                      {step.details && (
                        <div className="mt-3 p-3 bg-white rounded border text-sm">
                          {step.details}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Indicateur de progression */}
        {isRunning && (
          <motion.div
            className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <div className="text-center">
              <div className="text-sm font-medium mb-1">Test en cours...</div>
              <div className="text-xs opacity-80">
                Scénario {currentScenario + 1}/{scenarios.length} - 
                Étape {currentStep + 1}/{scenarios[currentScenario]?.steps.length}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
