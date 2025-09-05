import React, { ReactNode } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

// Parallax Hero Component
interface ParallaxHeroProps {
  children: ReactNode
  className?: string
}

export function ParallaxHero({ children, className = '' }: ParallaxHeroProps) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, -150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8])

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ y, opacity }}
    >
      {children}
    </motion.div>
  )
}

// Text Reveal Component
interface TextRevealProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function TextReveal({ children, delay = 0, className = '' }: TextRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

// Floating Element Component
interface FloatingElementProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function FloatingElement({ children, delay = 0, className = '' }: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{ y: -5 }}
    >
      {children}
    </motion.div>
  )
}

// Gradient Text Component
interface GradientTextProps {
  children: ReactNode
  className?: string
}

export function GradientText({ children, className = '' }: GradientTextProps) {
  return (
    <span className={`bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  )
}

// Magnetic Button Component
interface MagneticButtonProps {
  children: ReactNode
  className?: string
}

export function MagneticButton({ children, className = '' }: MagneticButtonProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  )
}

// 3D Card Component
interface Card3DProps {
  children: ReactNode
  className?: string
}

export function Card3D({ children, className = '' }: Card3DProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ 
        rotateY: 5,
        rotateX: 5,
        scale: 1.02
      }}
      transition={{ duration: 0.3 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  )
}

// Morphing Background Component
interface MorphingBackgroundProps {
  children: ReactNode
  className?: string
}

export function MorphingBackground({ children, className = '' }: MorphingBackgroundProps) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      animate={{
        background: [
          "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
          "linear-gradient(45deg, #f093fb 0%, #f5576c 100%)",
          "linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)",
          "linear-gradient(45deg, #667eea 0%, #764ba2 100%)"
        ]
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    >
      {children}
    </motion.div>
  )
}

// Scroll Progress Component
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-50"
      style={{ scaleX, transformOrigin: "0%" }}
    />
  )
}