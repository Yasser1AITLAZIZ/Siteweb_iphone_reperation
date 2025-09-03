import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useScrollDirection, getAdaptiveConfig, shouldReduceMotion } from '../utils/scrollOptimization'

const ScrollPerformanceTest: React.FC = () => {
  const [scrollY, setScrollY] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  const [performanceMode, setPerformanceMode] = useState<'normal' | 'low'>('normal')
  const { requestTick } = useScrollDirection()
  const config = getAdaptiveConfig()

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.pageYOffset)
      requestTick()
      
      // Détecter la direction du scroll
      const currentDirection = window.pageYOffset > scrollY ? 'down' : 'up'
      if (currentDirection !== scrollDirection) {
        setScrollDirection(currentDirection)
      }
    }

    // Vérifier le mode de performance
    const checkPerformance = () => {
      const isLowPerformance = shouldReduceMotion()
      setPerformanceMode(isLowPerformance ? 'low' : 'normal')
    }

    checkPerformance()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', checkPerformance)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', checkPerformance)
    }
  }, [scrollY, scrollDirection, requestTick])

}

export default ScrollPerformanceTest
