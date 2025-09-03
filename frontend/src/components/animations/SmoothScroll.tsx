import React, { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

interface SmoothScrollProps {
  children: React.ReactNode
  className?: string
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({ children, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Transformations fluides optimisées pour le scrolling
  const y = useTransform(scrollYProgress, [0, 1], [0, -30])
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [1, 1, 0.9, 0.8])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.01, 1])

  // Spring animations ultra-fluides avec paramètres optimisés
  const springY = useSpring(y, { 
    stiffness: 150, 
    damping: 25, 
    restDelta: 0.001,
    mass: 0.8
  })
  const springOpacity = useSpring(opacity, { 
    stiffness: 150, 
    damping: 25, 
    restDelta: 0.001 
  })
  const springScale = useSpring(scale, { 
    stiffness: 150, 
    damping: 25, 
    restDelta: 0.001 
  })

  return (
    <motion.div
      ref={containerRef}
      className={`smooth-scroll-container ${className}`}
      style={{
        y: springY,
        opacity: springOpacity,
        scale: springScale,
        willChange: 'transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
      }}
    >
      {children}
    </motion.div>
  )
}

// Composant pour les sections avec défilement fluide optimisé
export const SmoothSection: React.FC<{
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}> = ({ children, className = '', delay = 0, direction = 'up' }) => {
  const getTransform = () => {
    switch (direction) {
      case 'up': return { y: 60 }
      case 'down': return { y: -60 }
      case 'left': return { x: 60 }
      case 'right': return { x: -60 }
      default: return { y: 60 }
    }
  }

  return (
    <motion.div
      className={`smooth-section ${className}`}
      initial={{ opacity: 0, ...getTransform() }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0,
        transition: {
          duration: 0.6,
          delay: delay * 0.1, // Réduction des délais pour plus de fluidité
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }}
      viewport={{ once: true, margin: "-50px" }}
      style={{
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
      }}
    >
      {children}
    </motion.div>
  )
}

// Composant pour le défilement parallaxe ultra-fluide
export const ParallaxScroll: React.FC<{
  children: React.ReactNode
  speed?: number
  className?: string
}> = ({ children, speed = 0.3, className = '' }) => {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -80 * speed])
  
  // Spring pour le parallaxe fluide
  const springY = useSpring(y, { 
    stiffness: 200, 
    damping: 30, 
    restDelta: 0.001 
  })

  return (
    <motion.div
      className={`parallax-scroll ${className}`}
      style={{ 
        y: springY,
        willChange: 'transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
      }}
    >
      {children}
    </motion.div>
  )
}

// Composant pour les transitions de page ultra-fluides
export const PageTransition: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`page-transition ${className}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      style={{
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
      }}
    >
      {children}
    </motion.div>
  )
}

// Hook personnalisé pour le défilement ultra-fluide
export const useSmoothScroll = () => {
  const { scrollYProgress } = useScroll()
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 25,
    restDelta: 0.001,
    mass: 0.8
  })

  return { scrollYProgress: smoothProgress }
}

export default SmoothScroll
