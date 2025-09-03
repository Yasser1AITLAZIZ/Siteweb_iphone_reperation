import { useEffect, useRef, useState, useCallback } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  root?: Element | null
  rootMargin?: string
  freezeOnceVisible?: boolean
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const elementRef = useRef<Element | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false
  } = options

  const setElement = useCallback((element: Element | null) => {
    elementRef.current = element
  }, [])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting
        
        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }

        if (freezeOnceVisible && hasIntersected) {
          setIsIntersecting(true)
        } else {
          setIsIntersecting(isElementIntersecting)
        }
      },
      {
        threshold,
        root,
        rootMargin
      }
    )

    observerRef.current = observer
    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, root, rootMargin, hasIntersected, freezeOnceVisible])

  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }
  }, [])

  return {
    isIntersecting,
    hasIntersected,
    setElement,
    disconnect
  }
} 