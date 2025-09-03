import { motion, type MotionProps } from 'framer-motion'
import { forwardRef, type ReactNode } from 'react'

interface StaggerContainerProps extends MotionProps {
  children: ReactNode
  staggerDelay?: number
  className?: string
}

const StaggerContainer = forwardRef<HTMLDivElement, StaggerContainerProps>(
  ({ children, staggerDelay = 0.1, className = '', ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: staggerDelay
            }
          }
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

StaggerContainer.displayName = 'StaggerContainer'

export default StaggerContainer 