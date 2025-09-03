import React from 'react'
import { motion } from 'framer-motion'
import { Card3D } from './animations/AppleAnimations'

export default function HeroImage() {
  return (
    <div className="relative w-full h-96">
      {/* iPhone 3D Model */}
      <Card3D className="w-full h-full">
        <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl overflow-hidden shadow-2xl">
          {/* iPhone Body */}
          <div className="absolute inset-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-slate-700">
            {/* Screen */}
            <div className="absolute inset-2 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 rounded-2xl overflow-hidden">
              {/* Dynamic Island */}
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20"></div>
              
              {/* App Icons Grid */}
              <div className="absolute inset-0 p-8">
                <div className="grid grid-cols-4 gap-4 h-full">
                  {[...Array(16)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-12 h-12 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                    >
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg"></div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute top-20 right-8 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-80"
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <motion.div
                className="absolute bottom-20 left-8 w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full opacity-80"
                animate={{ 
                  y: [0, 15, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />

              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-pink-500 to-red-600 rounded-full opacity-60"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 0.9, 0.6]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
            </div>

            {/* Camera Module */}
            <div className="absolute top-6 right-6 w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                <div className="w-5 h-5 bg-green-500 rounded-full"></div>
                <div className="w-5 h-5 bg-purple-500 rounded-full"></div>
                <div className="w-5 h-5 bg-yellow-500 rounded-full"></div>
              </div>
            </div>

            {/* Side Button */}
            <div className="absolute top-1/2 -right-1 w-2 h-16 bg-slate-700 rounded-l-full"></div>
          </div>

          {/* Glow Effects */}
          <motion.div
            className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl opacity-20 blur-xl"
            animate={{
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </Card3D>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.6, 0, 0.6],
              scale: [1, 0, 1]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Reflection */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent rounded-3xl pointer-events-none" />
    </div>
  )
}
