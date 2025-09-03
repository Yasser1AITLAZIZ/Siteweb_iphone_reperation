import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'

// Parallax Hero Section
export const ParallaxHero: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className="relative"
    >
      {children}
    </motion.div>
  )
}

// Sticky Section avec effet de parallaxe
export const StickySection: React.FC<{ 
  children: React.ReactNode
  className?: string
}> = ({ children, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity }}
      className={`sticky top-0 ${className}`}
    >
      {children}
    </motion.div>
  )
}

// Text Reveal Animation
export const TextReveal: React.FC<{ 
  children: React.ReactNode
  className?: string
  delay?: number
}> = ({ children, className = "", delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Floating Elements Animation
export const FloatingElement: React.FC<{ 
  children: React.ReactNode
  className?: string
  delay?: number
}> = ({ children, className = "", delay = 0 }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 1, 
        delay,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Gradient Text Animation
export const GradientText: React.FC<{ 
  children: React.ReactNode
  className?: string
}> = ({ children, className = "" }) => {
  return (
    <motion.span
      className={`bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent ${className}`}
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{ backgroundPosition: "100% 50%" }}
      transition={{ 
        duration: 3, 
        repeat: Infinity, 
        repeatType: "reverse",
        ease: "linear"
      }}
      style={{
        backgroundSize: "200% 200%"
      }}
    >
      {children}
    </motion.span>
  )
}

// Magnetic Button Effect
export const MagneticButton: React.FC<{ 
  children: React.ReactNode
  className?: string
  onClick?: () => void
}> = ({ children, className = "", onClick }) => {
  const ref = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  const x = useSpring(position.x, { stiffness: 150, damping: 15 })
  const y = useSpring(position.y, { stiffness: 150, damping: 15 })

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x, y }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      {children}
    </motion.button>
  )
}

// Scroll Progress Indicator
export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 origin-left z-50"
      style={{ scaleX }}
    />
  )
}

// Card Hover Effect avec 3D
export const Card3D: React.FC<{ 
  children: React.ReactNode
  className?: string
}> = ({ children, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10
    
    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
  }

  const handleMouseLeave = () => {
    if (ref.current) {
      ref.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    }
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`transition-all duration-300 ${className}`}
      style={{
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </motion.div>
  )
}

// Infinite Scroll Text
export const InfiniteScrollText: React.FC<{ 
  text: string
  className?: string
}> = ({ text, className = "" }) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="whitespace-nowrap"
        animate={{ x: [0, -50] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <span className="inline-block mr-8">{text}</span>
        <span className="inline-block mr-8">{text}</span>
        <span className="inline-block mr-8">{text}</span>
      </motion.div>
    </div>
  )
}

// Morphing Background
export const MorphingBackground: React.FC<{ 
  children: React.ReactNode
  className?: string
}> = ({ children, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100"
        animate={{
          scale: isHovered ? 1.1 : 1,
          rotate: isHovered ? 5 : 0,
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}
