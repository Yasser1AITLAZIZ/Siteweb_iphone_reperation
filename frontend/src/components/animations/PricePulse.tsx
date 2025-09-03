import { motion, useAnimation } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useIntersectionObserver } from '../../hooks'
import { formatPriceDH } from '../../lib/utils'

interface PricePulseProps {
  price: number
  originalPrice?: number
  className?: string
  showDiscount?: boolean
}

export function PricePulse({ 
  price, 
  originalPrice, 
  className = '',
  showDiscount = true 
}: PricePulseProps) {
  const [isVisible, setIsVisible] = useState(false)
  const controls = useAnimation()
  const { isIntersecting: inView, setElement } = useIntersectionObserver({
    threshold: 0.5,
    freezeOnceVisible: true
  })

  useEffect(() => {
    if (inView) {
      setIsVisible(true)
      controls.start('visible')
    }
  }, [inView, controls])

  const hasDiscount = originalPrice && originalPrice > price
  const discountPercentage = hasDiscount 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  const pulseVariants = {
    hidden: { 
      scale: 0.8, 
      opacity: 0,
      y: 20
    },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  }

  const priceVariants = {
    hidden: { scale: 1 },
    visible: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 3
      }
    }
  }

  const discountVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.3,
        duration: 0.5
      }
    }
  }

  return (
    <motion.div
      ref={(el) => setElement(el)}
      className={`flex items-center space-x-3 ${className}`}
      variants={pulseVariants}
      initial="hidden"
      animate={controls}
    >
      {/* Current Price */}
      <motion.div
        className="text-3xl font-bold text-primary"
        variants={priceVariants}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
      >
        {formatPriceDH(price)}
      </motion.div>

      {/* Original Price & Discount */}
      {hasDiscount && (
        <motion.div
          className="flex flex-col items-start"
          variants={discountVariants}
          initial="hidden"
          animate={controls}
        >
          <span className="text-lg text-muted-foreground line-through">
            {formatPriceDH(originalPrice)}
          </span>
          {showDiscount && (
            <motion.span
              className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
            >
              -{discountPercentage}%
            </motion.span>
          )}
        </motion.div>
      )}

      {/* Pulse Effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/20"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </motion.div>
  )
} 