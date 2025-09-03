import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
  duration?: number
  delay?: number
  threshold?: number
}

export function ScrollReveal({ 
  children, 
  className = '',
  direction = 'up',
  distance = 50,
  duration = 0.8,
  delay = 0,
  threshold = 0.1
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', `start ${1 - threshold}`]
  })

  const getTransformValue = () => {
    switch (direction) {
      case 'up':
        return useTransform(scrollYProgress, [0, 1], [distance, 0])
      case 'down':
        return useTransform(scrollYProgress, [0, 1], [-distance, 0])
      case 'left':
        return useTransform(scrollYProgress, [0, 1], [distance, 0])
      case 'right':
        return useTransform(scrollYProgress, [0, 1], [-distance, 0])
      default:
        return useTransform(scrollYProgress, [0, 1], [distance, 0])
    }
  }

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1])
  const transform = getTransformValue()

  const getTransformStyle = () => {
    if (direction === 'left' || direction === 'right') {
      return { x: transform }
    }
    return { y: transform }
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        opacity,
        ...getTransformStyle()
      }}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      {children}
    </motion.div>
  )
} 