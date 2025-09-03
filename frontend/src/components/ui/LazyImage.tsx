import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useIntersectionObserver } from '../../hooks'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
  threshold?: number
  rootMargin?: string
}

export function LazyImage({ 
  src, 
  alt, 
  className = '',
  placeholder = '/placeholder.svg',
  threshold = 0.1,
  rootMargin = '50px'
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  const { setElement } = useIntersectionObserver({
    threshold,
    rootMargin,
    freezeOnceVisible: true
  })

  useEffect(() => {
    if (imgRef.current) {
      setElement(imgRef.current)
    }
  }, [setElement])

  useEffect(() => {
    if (isInView && !isLoaded && !hasError) {
      const img = new Image()
      img.onload = () => setIsLoaded(true)
      img.onerror = () => setHasError(true)
      img.src = src
    }
  }, [isInView, src, isLoaded, hasError])

  const handleIntersection = (intersecting: boolean) => {
    setIsInView(intersecting)
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence>
        {/* Placeholder */}
        {!isLoaded && !hasError && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-muted animate-pulse"
          >
            <img
              src={placeholder}
              alt=""
              className="w-full h-full object-cover opacity-50"
            />
          </motion.div>
        )}

        {/* Error State */}
        {hasError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-muted flex items-center justify-center"
          >
            <div className="text-center text-muted-foreground">
              <div className="text-2xl mb-2">📷</div>
              <div className="text-sm">Image non disponible</div>
            </div>
          </motion.div>
        )}

        {/* Actual Image */}
        {isLoaded && !hasError && (
          <motion.img
            ref={imgRef}
            src={src}
            alt={alt}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full h-full object-cover"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
          />
        )}
      </AnimatePresence>

      {/* Loading Spinner */}
      {isInView && !isLoaded && !hasError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-background/50"
        >
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}
    </div>
  )
} 