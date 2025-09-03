import { Link } from 'react-router-dom'
import { FadeInUp, HoverCard, CountUp } from '../components/animations'
import { 
  ParallaxHero, 
  TextReveal, 
  FloatingElement, 
  GradientText, 
  MagneticButton,
  Card3D,
  MorphingBackground,
  ScrollProgress
} from '../components/animations/AppleAnimations'
import { motion } from 'framer-motion'
import HeroImage from '../components/HeroImage'
import { SmoothScroll, SmoothSection, ParallaxScroll, PageTransition } from '../components/animations/SmoothScroll'
import ScrollPerformanceTest from '../components/ScrollPerformanceTest'
import colors from '../styles/colors'

export default function Index() {
  return (
    <PageTransition>
      <ScrollProgress />
      <ScrollPerformanceTest />
      <div className="min-h-screen overflow-hidden" style={{ background: colors.gradients.elegant }}>
        
        {/* Hero Section ultra-moderne avec Glassmorphism */}
        <SmoothScroll>
          <ParallaxHero>
            <section className="relative py-32 overflow-hidden">
              {/* Background sophistiqué avec gradients mesh */}
              <div className="absolute inset-0 gradient-mesh opacity-30"></div>
              
              {/* Éléments flottants modernes */}
              <div className="absolute inset-0">
                <motion.div 
                  className="absolute top-20 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-20"
                  style={{ background: colors.accent.silver }}
                  animate={{ 
                    y: [0, -20, 0],
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.3, 0.2]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                  className="absolute top-40 right-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-20"
                  style={{ background: colors.accent.platinum }}
                  animate={{ 
                    y: [0, 20, 0],
                    scale: [1, 0.9, 1],
                    opacity: [0.2, 0.3, 0.2]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
                <motion.div 
                  className="absolute -bottom-8 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-20"
                  style={{ background: colors.accent.chrome }}
                  animate={{ 
                    y: [0, -15, 0],
                    scale: [1, 1.05, 1],
                    opacity: [0.2, 0.25, 0.2]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />
              </div>
              
              <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  {/* Left Content avec animations optimisées */}
                  <div className="space-y-8">
                    <FloatingElement delay={0.1}>
                      <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium card-glass animate-float-gentle">
                        <div className="w-2 h-2 rounded-full mr-3 animate-pulse-soft" style={{ background: colors.accent.steel }}></div>
                        Réparation express en moins de 30 minutes
                      </div>
                    </FloatingElement>
                    
                    <TextReveal delay={0.2}>
                      <h1 className="text-6xl md:text-7xl font-bold leading-tight bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent">
                        Réparez votre iPhone
                        <span className="block">
                          <GradientText>comme un pro</GradientText>
                        </span>
                      </h1>
                    </TextReveal>
                    
                    <TextReveal delay={0.4}>
                      <p className="text-xl md:text-2xl leading-relaxed text-gray-600">
                        Expertise technique, pièces de qualité OEM et garantie jusqu'à 12 mois. 
                        Votre iPhone entre de bonnes mains.
                      </p>
                    </TextReveal>
                    
                    <TextReveal delay={0.6}>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <MagneticButton>
                          <Link 
                            to="/reparations" 
                            className="px-10 py-5 text-white rounded-full text-lg font-semibold transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
                            style={{ background: colors.gradients.blackToSilver }}
                          >
                            Réparer mon iPhone →
                          </Link>
                        </MagneticButton>
                        <MagneticButton>
                          <Link 
                            to="/boutique" 
                            className="px-10 py-5 border-2 rounded-full text-lg font-semibold transition-all duration-300 card-glass hover:scale-105"
                            style={{ borderColor: colors.silver[400], color: colors.black[700] }}
                          >
                            ▷ Voir nos réalisations
                          </Link>
                        </MagneticButton>
                      </div>
                    </TextReveal>
                    
                    {/* Stats avec animations modernes */}
                    <TextReveal delay={0.8}>
                      <div className="flex space-x-8 pt-8">
                        <motion.div 
                          className="text-center group"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            15min
                          </div>
                          <div className="text-sm text-gray-600">Diagnostic</div>
                        </motion.div>
                        <motion.div 
                          className="text-center group"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            12 mois
                          </div>
                          <div className="text-sm text-gray-600">Garantie</div>
                        </motion.div>
                        <motion.div 
                          className="text-center group"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            98%
                          </div>
                          <div className="text-sm text-gray-600">Succès</div>
                        </motion.div>
                      </div>
                    </TextReveal>
                  </div>
                  
                  {/* Right Image avec HeroImage animé */}
                  <FloatingElement delay={0.4}>
                    <div className="relative">
                      <HeroImage />
                      {/* Éléments flottants modernes */}
                      <motion.div 
                        className="absolute -top-4 -right-4 w-8 h-8 rounded-full shadow-lg card-glass"
                        style={{ background: colors.accent.steel }}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.div 
                        className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full shadow-lg card-glass"
                        style={{ background: colors.accent.graphite }}
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      />
                    </div>
                  </FloatingElement>
                </div>
              </div>
            </section>
          </ParallaxHero>
        </SmoothScroll>

        {/* Trust Section avec Glassmorphism moderne */}
        <SmoothSection delay={0.2}>
          <section className="py-24 relative">
            <div className="absolute inset-0 gradient-aurora opacity-20"></div>
            <div className="container mx-auto px-4 relative z-10">
              <TextReveal>
                <h2 className="text-5xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                  La confiance de milliers de clients
                </h2>
              </TextReveal>
              
              <TextReveal delay={0.2}>
                <p className="text-xl md:text-2xl text-center mb-16 max-w-3xl mx-auto text-gray-600">
                  Des chiffres qui parlent d'eux-mêmes et témoignent de notre expertise dans la réparation iPhone
                </p>
              </TextReveal>
              
              <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                <FloatingElement delay={0.3}>
                  <Card3D>
                    <div className="text-center p-8 rounded-3xl card-glass hover:scale-105 transition-all duration-500">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 card-glass">
                        <div className="text-2xl">👥</div>
                      </div>
                      <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        <CountUp end={12500} delay={0.5} />+
                      </div>
                      <div className="text-lg font-semibold mb-2 text-gray-900">iPhones réparés</div>
                      <div className="text-sm text-gray-600">Depuis notre ouverture</div>
                    </div>
                  </Card3D>
                </FloatingElement>
                
                <FloatingElement delay={0.4}>
                  <Card3D>
                    <div className="text-center p-8 rounded-3xl card-glass hover:scale-105 transition-all duration-500">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 card-glass">
                        <div className="text-2xl">⭐</div>
                      </div>
                      <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">4.9/5</div>
                      <div className="text-lg font-semibold mb-2 text-gray-900">Note moyenne</div>
                      <div className="text-sm text-gray-600">Sur plus de 2 800 avis</div>
                    </div>
                  </Card3D>
                </FloatingElement>
                
                <FloatingElement delay={0.5}>
                  <Card3D>
                    <div className="text-center p-8 rounded-3xl card-glass hover:scale-105 transition-all duration-500">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 card-glass">
                        <div className="text-2xl">🛡️</div>
                      </div>
                      <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">98%</div>
                      <div className="text-lg font-semibold mb-2 text-gray-900">Clients satisfaits</div>
                      <div className="text-sm text-gray-600">Recommandent nos services</div>
                    </div>
                  </Card3D>
                </FloatingElement>
                
                <FloatingElement delay={0.6}>
                  <Card3D>
                    <div className="text-center p-8 rounded-3xl card-glass hover:scale-105 transition-all duration-500">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 card-glass">
                        <div className="text-2xl">⏰</div>
                      </div>
                      <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">25min</div>
                      <div className="text-lg font-semibold mb-2 text-gray-900">Temps moyen</div>
                      <div className="text-sm text-gray-600">De réparation express</div>
                    </div>
                  </Card3D>
                </FloatingElement>
              </div>
              
              <TextReveal delay={0.8}>
                <div className="text-center mt-16">
                  <div className="inline-flex items-center space-x-2 text-gray-600">
                    <div className="flex space-x-1">
                      {['A', 'B', 'C', 'D', 'E'].map((letter, index) => (
                        <motion.div 
                          key={letter} 
                          className="w-3 h-3 rounded-full bg-blue-500"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                        />
                      ))}
                    </div>
                    <span className="ml-4 text-lg">Rejoint par plus de 12 500 clients satisfaits</span>
                  </div>
                </div>
              </TextReveal>
            </div>
          </section>
        </SmoothSection>

        {/* Reviews Section avec Glassmorphism */}
        <SmoothSection delay={0.3}>
          <section className="py-24 relative">
            <div className="absolute inset-0 gradient-mesh opacity-15"></div>
            <div className="container mx-auto px-4 relative z-10">
              <TextReveal>
                <h2 className="text-5xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                  Ce que disent nos clients
                </h2>
              </TextReveal>
              
              <TextReveal delay={0.2}>
                <p className="text-xl md:text-2xl text-center mb-16 max-w-3xl mx-auto text-gray-600">
                  Découvrez l'expérience de nos clients et leur satisfaction après nos réparations iPhone
                </p>
              </TextReveal>
              
              <div className="max-w-4xl mx-auto">
                <FloatingElement delay={0.4}>
                  <Card3D>
                    <div className="rounded-3xl card-glass p-8 md:p-12 hover:scale-105 transition-all duration-500">
                      <div className="flex items-start space-x-6">
                        <motion.div 
                          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold card-glass"
                          style={{ background: colors.accent.steel }}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          AR
                        </motion.div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">Alexandre R.</h3>
                              <p className="text-gray-600">iPhone 15 Pro • Module caméra</p>
                            </div>
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <motion.div 
                                  key={i} 
                                  className="w-5 h-5 text-yellow-400"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: i * 0.1 }}
                                >
                                  ⭐
                                </motion.div>
                              ))}
                            </div>
                          </div>
                          <p className="text-lg leading-relaxed text-gray-700">
                            "Caméra arrière réparée rapidement. Photos parfaites maintenant. Service client au top, merci !"
                          </p>
                          <p className="text-sm mt-4 text-gray-500">Il y a 5 jours</p>
                        </div>
                      </div>
                    </div>
                  </Card3D>
                </FloatingElement>
                
                <TextReveal delay={0.6}>
                  <div className="flex items-center justify-center space-x-4 mt-8">
                    <motion.button 
                      className="w-10 h-10 rounded-full flex items-center justify-center card-glass hover:scale-110 transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="text-gray-600">‹</span>
                    </motion.button>
                    <div className="flex space-x-2">
                      {[...Array(5)].map((_, i) => (
                        <motion.div 
                          key={i} 
                          className={`w-3 h-3 rounded-full ${i === 2 ? 'bg-blue-500' : 'bg-gray-300'}`}
                          whileHover={{ scale: 1.2 }}
                        />
                      ))}
                    </div>
                    <motion.button 
                      className="w-10 h-10 rounded-full flex items-center justify-center card-glass hover:scale-110 transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="text-gray-600">›</span>
                    </motion.button>
                  </div>
                  <p className="text-center text-sm mt-4 text-gray-500">Rotation automatique</p>
                  <motion.p 
                    className="text-center text-2xl font-bold mt-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                  >
                    4.9/5
                  </motion.p>
                </TextReveal>
              </div>
            </div>
          </section>
        </SmoothSection>

        {/* Trust Features avec Glassmorphism moderne */}
        <SmoothSection delay={0.4}>
          <section className="py-24 relative">
            <div className="absolute inset-0 gradient-aurora opacity-15"></div>
            <div className="container mx-auto px-4 relative z-10">
              <TextReveal>
                <h2 className="text-5xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                  Votre confiance, notre priorité
                </h2>
              </TextReveal>
              
              <TextReveal delay={0.2}>
                <p className="text-xl md:text-2xl text-center mb-16 max-w-3xl mx-auto text-gray-600">
                  Des garanties solides et un service de qualité pour votre tranquillité d'esprit
                </p>
              </TextReveal>
              
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[
                  { icon: '🛡️', title: 'Garantie 12 mois', desc: 'Sur toutes nos réparations', color: 'from-blue-600 to-purple-600' },
                  { icon: '🔑', title: 'Pièces OEM', desc: 'Qualité constructeur', color: 'from-green-600 to-blue-600' },
                  { icon: '⏰', title: 'Réparation express', desc: 'En moins de 30 min', color: 'from-orange-600 to-red-600' },
                  { icon: '🔄', title: 'Retour gratuit', desc: 'Sous 14 jours', color: 'from-purple-600 to-pink-600' },
                  { icon: '💳', title: 'Paiement sécurisé', desc: 'CB, PayPal, Virement', color: 'from-indigo-600 to-purple-600' },
                  { icon: '🚚', title: 'Livraison offerte', desc: 'Dès 500 DH d\'achat', color: 'from-teal-600 to-green-600' }
                ].map((feature, index) => (
                  <FloatingElement key={index} delay={0.3 + index * 0.1}>
                    <Card3D>
                      <div className="text-center p-8 rounded-3xl card-glass hover:scale-105 transition-all duration-500">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 card-glass">
                          <div className="text-2xl">{feature.icon}</div>
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                        <p className="text-gray-600">{feature.desc}</p>
                      </div>
                    </Card3D>
                  </FloatingElement>
                ))}
              </div>
            </div>
          </section>
        </SmoothSection>

        {/* Partners Section avec Glassmorphism */}
        <SmoothSection delay={0.5}>
          <section className="py-24 relative">
            <div className="absolute inset-0 gradient-mesh opacity-10"></div>
            <div className="container mx-auto px-4 relative z-10">
              <TextReveal>
                <h2 className="text-5xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                  Partenaires de confiance
                </h2>
              </TextReveal>
              
              <TextReveal delay={0.2}>
                <p className="text-xl md:text-2xl text-center mb-16 max-w-3xl mx-auto text-gray-600">
                  Nous travaillons avec les plus grandes enseignes
                </p>
              </TextReveal>
              
              <FloatingElement delay={0.4}>
                <div className="flex justify-center items-center space-x-12 opacity-60">
                  {[...Array(5)].map((_, i) => (
                    <motion.div 
                      key={i}
                      className="w-24 h-12 rounded-lg card-glass"
                      animate={{ 
                        y: [0, -5, 0],
                        opacity: [0.6, 0.8, 0.6]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        delay: i * 0.2 
                      }}
                    />
                  ))}
                </div>
              </FloatingElement>
            </div>
          </section>
        </SmoothSection>
      </div>
    </PageTransition>
  )
}
