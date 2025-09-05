import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface PerformanceMetrics {
  fps: number
  scrollSmoothness: number
  renderTime: number
}

export default function ScrollPerformanceTest() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    scrollSmoothness: 100,
    renderTime: 16
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    let animationId: number

    const measurePerformance = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        
        setMetrics(prev => ({
          ...prev,
          fps,
          scrollSmoothness: Math.min(100, fps * 1.67), // Convert FPS to percentage
          renderTime: Math.round(1000 / fps)
        }))
        
        frameCount = 0
        lastTime = currentTime
      }
      
      animationId = requestAnimationFrame(measurePerformance)
    }

    animationId = requestAnimationFrame(measurePerformance)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white text-xs font-mono cursor-pointer"
        onClick={() => setIsVisible(!isVisible)}
        onMouseEnter={() => setIsVisible(true)}
      >
        {isVisible ? (
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${metrics.fps >= 55 ? 'bg-green-400' : metrics.fps >= 30 ? 'bg-yellow-400' : 'bg-red-400'}`} />
              <span>FPS: {metrics.fps}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${metrics.scrollSmoothness >= 90 ? 'bg-green-400' : metrics.scrollSmoothness >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`} />
              <span>Scroll: {metrics.scrollSmoothness}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${metrics.renderTime <= 20 ? 'bg-green-400' : metrics.renderTime <= 33 ? 'bg-yellow-400' : 'bg-red-400'}`} />
              <span>Render: {metrics.renderTime}ms</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${metrics.fps >= 55 ? 'bg-green-400' : metrics.fps >= 30 ? 'bg-yellow-400' : 'bg-red-400'}`} />
            <span>Perf</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}