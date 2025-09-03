import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface CountUpProps {
  end: number
  duration?: number
  delay?: number
  className?: string
  prefix?: string
  suffix?: string
}

export default function CountUp({ 
  end, 
  duration = 2, 
  delay = 0, 
  className = "",
  prefix = "",
  suffix = ""
}: CountUpProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / (duration * 1000), 1)
        
        setCount(Math.floor(end * progress))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      animate()
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [end, duration, delay])

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      className={className}
    >
      {prefix}{count}{suffix}
    </motion.span>
  )
} 