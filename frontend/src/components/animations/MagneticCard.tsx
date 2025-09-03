import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, useState, type ReactNode } from 'react'

interface MagneticCardProps {
  children: ReactNode
  className?: string
  intensity?: number
  scaleOnHover?: boolean
}

export function MagneticCard({ 
  children, 
  className = '', 
  intensity = 0.3,
  scaleOnHover = true 
}: MagneticCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springConfig = { damping: 15, stiffness: 150 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)
  
  const rotateX = useTransform(springY, [-100, 100], [15, -15])
  const rotateY = useTransform(springX, [-100, 100], [-15, 15])
  
  const scale = useTransform(springX, [-100, 0, 100], [0.95, 1, 0.95])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const mouseX = event.clientX - centerX
    const mouseY = event.clientY - centerY
    
    x.set(mouseX * intensity)
    y.set(mouseY * intensity)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  return (
    <motion.div
      ref={ref}
      className={`perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        transformStyle: 'preserve-3d'
      }}
      animate={{
        scale: scaleOnHover && isHovered ? 1.05 : 1,
        transition: { duration: 0.2 }
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d'
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  )
} 