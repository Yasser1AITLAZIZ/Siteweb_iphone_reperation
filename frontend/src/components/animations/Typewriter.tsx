import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TypewriterProps {
  text: string
  speed?: number
  delay?: number
  className?: string
  onComplete?: () => void
}

export default function Typewriter({ 
  text, 
  speed = 100, 
  delay = 0, 
  className = "",
  onComplete 
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      } else if (onComplete) {
        onComplete()
      }
    }, speed)

    return () => clearTimeout(timer)
  }, [currentIndex, text, speed, onComplete])

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {displayedText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-0.5 h-6 bg-current ml-1"
        />
      )}
    </motion.span>
  )
}
