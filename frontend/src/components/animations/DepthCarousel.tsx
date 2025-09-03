import { motion, useAnimation } from 'framer-motion'
import { useState, useEffect, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'

interface DepthCarouselProps {
  children: ReactNode[]
  className?: string
  autoPlay?: boolean
  interval?: number
  showArrows?: boolean
  showDots?: boolean
}

export function DepthCarousel({ 
  children, 
  className = '',
  autoPlay = true,
  interval = 5000,
  showArrows = true,
  showDots = true
}: DepthCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const controls = useAnimation()

  useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % children.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, children.length])

  useEffect(() => {
    controls.start('center')
  }, [currentIndex, controls])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % children.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + children.length) % children.length)
  }

  const getSlideStyle = (index: number) => {
    const distance = Math.abs(index - currentIndex)
    const isActive = index === currentIndex
    const isNext = index === (currentIndex + 1) % children.length
    const isPrev = index === (currentIndex - 1 + children.length) % children.length

    if (isActive) {
      return {
        zIndex: 30,
        scale: 1,
        opacity: 1,
        filter: 'brightness(1)',
        transform: 'translateZ(0px)'
      }
    } else if (isNext || isPrev) {
      return {
        zIndex: 20,
        scale: 0.8,
        opacity: 0.7,
        filter: 'brightness(0.8)',
        transform: `translateZ(-50px) translateX(${isNext ? '20%' : '-20%'})`
      }
    } else {
      return {
        zIndex: 10,
        scale: 0.6,
        opacity: 0.4,
        filter: 'brightness(0.6)',
        transform: `translateZ(-100px) translateX(${index > currentIndex ? '40%' : '-40%'})`
      }
    }
  }

  return (
    <div className={`relative w-full h-96 ${className}`}>
      {/* Carousel Container */}
      <div className="relative w-full h-full perspective-1000">
        {children.map((child, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 w-full h-full"
            style={getSlideStyle(index)}
            variants={{
              center: {
                ...getSlideStyle(index),
                transition: {
                  duration: 0.6,
                  ease: 'easeInOut'
                }
              }
            }}
            initial="center"
            animate={controls}
          >
            {child}
          </motion.div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40 bg-background/80 backdrop-blur-sm"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40 bg-background/80 backdrop-blur-sm"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-40">
          {children.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-primary scale-125'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-primary"
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{
          duration: interval / 1000,
          ease: 'linear'
        }}
        key={currentIndex}
      />
    </div>
  )
} 