import { motion, type MotionProps } from 'framer-motion'
import { forwardRef, type ReactNode } from 'react'

type SlideDirection = 'left' | 'right' | 'up' | 'down'

interface SlideInProps extends MotionProps {
  children: ReactNode
  direction?: SlideDirection
  delay?: number
  duration?: number
  className?: string
}

const SlideIn = forwardRef<HTMLDivElement, SlideInProps>(
  ({ children, direction = 'up', delay = 0, duration = 0.5, className = '', ...props }, ref) => {
    const getInitialPosition = () => {
      switch (direction) {
        case 'left':
          return { x: -20, opacity: 0 }
        case 'right':
          return { x: 20, opacity: 0 }
        case 'up':
          return { y: -20, opacity: 0 }
        case 'down':
          return { y: 20, opacity: 0 }
        default:
          return { y: -20, opacity: 0 }
      }
    }

    return (
      <motion.div
        ref={ref}
        initial={getInitialPosition()}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{
          duration,
          delay,
          ease: [0.4, 0, 0.2, 1]
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

SlideIn.displayName = 'SlideIn'

export default SlideIn 