import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

interface ShimmeredGlassHeaderProps {
  children: ReactNode
  className?: string
  blurIntensity?: number
  shimmerIntensity?: number
}

export function ShimmeredGlassHeader({ 
  children, 
  className = '',
  blurIntensity = 20,
  shimmerIntensity = 0.3
}: ShimmeredGlassHeaderProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  
  const backgroundOpacity = useTransform(scrollY, [0, 100], [0.1, 0.8])
  const backdropBlur = useTransform(scrollY, [0, 100], [blurIntensity, blurIntensity + 10])
  const borderOpacity = useTransform(scrollY, [0, 100], [0.1, 0.3])

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `rgba(255, 255, 255, ${backgroundOpacity})`,
        backdropFilter: `blur(${backdropBlur}px)`,
        borderBottom: `1px solid rgba(148, 163, 184, ${borderOpacity})`
      }}
    >
      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          x: ['-100%', '200%']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        }}
        style={{
          background: `linear-gradient(90deg, 
            transparent 0%, 
            rgba(255, 255, 255, ${shimmerIntensity}) 50%, 
            transparent 100%
          )`,
          width: '100%',
          height: '100%'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Subtle Border Glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        style={{
          opacity: borderOpacity
        }}
      />
    </motion.div>
  )
} 