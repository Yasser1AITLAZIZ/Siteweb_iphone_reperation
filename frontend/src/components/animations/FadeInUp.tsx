import React from 'react'
import { motion } from 'framer-motion'

interface FadeInUpProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

export default function FadeInUp({ 
  children, 
  delay = 0, 
  duration = 0.6, 
  className = "" 
}: FadeInUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
} 