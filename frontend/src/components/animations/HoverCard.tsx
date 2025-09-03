import React from 'react'
import { motion } from 'framer-motion'

interface HoverCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export default function HoverCard({ children, className = "", delay = 0 }: HoverCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.3, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      whileHover={{ 
        scale: 1.05,
        y: -5,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className={`${className} cursor-pointer`}
    >
      {children}
    </motion.div>
  )
}
