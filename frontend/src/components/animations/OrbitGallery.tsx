import { motion, useAnimation } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useIntersectionObserver } from '../../hooks'

interface OrbitItem {
  id: string
  name: string
  image: string
  angle: number
  radius: number
}

interface OrbitGalleryProps {
  items: OrbitItem[]
  className?: string
}

export function OrbitGallery({ items, className = '' }: OrbitGalleryProps) {
  const [isHovered, setIsHovered] = useState(false)
  const controls = useAnimation()
  const { isIntersecting: inView, setElement } = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: false
  })

  useEffect(() => {
    if (inView) {
      controls.start('animate')
    }
  }, [inView, controls])

  const orbitVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: isHovered ? 360 : 0,
      transition: {
        duration: isHovered ? 20 : 40,
        ease: 'linear',
        repeat: Infinity
      }
    }
  }

  const itemVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: 'easeOut'
      }
    })
  }

  return (
    <div
      ref={(el) => setElement(el)}
      className={`relative w-full h-96 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Center point */}
      <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10" />
      
      {/* Orbit ring */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-80 h-80 border border-primary/20 rounded-full transform -translate-x-1/2 -translate-y-1/2"
        variants={orbitVariants}
        initial="initial"
        animate={controls}
      />
      
      {/* Orbiting items */}
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          className="absolute top-1/2 left-1/2 w-16 h-20 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            transformOrigin: 'center',
            transform: `rotate(${item.angle}deg) translateX(${item.radius}px) rotate(-${item.angle}deg)`
          }}
          variants={itemVariants}
          initial="initial"
          animate={controls}
          custom={index}
        >
          <motion.div
            className="w-full h-full relative group"
            whileHover={{ scale: 1.1, z: 20 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-contain drop-shadow-lg"
            />
            
            {/* Hover tooltip */}
            <motion.div
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
            >
              {item.name}
            </motion.div>
          </motion.div>
        </motion.div>
      ))}
      
      {/* Floating particles */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          rotate: [0, 360]
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              top: `${20 + (i * 10)}%`,
              left: `${20 + (i * 15)}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>
    </div>
  )
} 