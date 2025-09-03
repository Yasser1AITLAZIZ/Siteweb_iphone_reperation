import { lazy, type ComponentType } from 'react'

// Lazy load components with loading fallback
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  return lazy(importFunc)
}

// Preload components for better UX
export function preloadComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  return () => {
    importFunc()
  }
}

// Route-based code splitting
export const lazyRoutes = {
  Home: lazy(() => import('../pages/Index')),
  Reparations: lazy(() => import('../pages/Reparations')),
  Boutique: lazy(() => import('../pages/Boutique')),
  FAQ: lazy(() => import('../pages/FAQ')),
  UIPlayground: lazy(() => import('../pages/playground/ui')),
  TokensPlayground: lazy(() => import('../pages/playground/tokens'))
}

// Component-based code splitting
export const lazyComponents = {
  ServiceCard: lazy(() => import('../components/ui/ServiceCard')),
  PhoneSelector: lazy(() => import('../components/ui/PhoneSelector')),
  PriceEstimator: lazy(() => import('../components/ui/PriceEstimator')),
  StatusBadge: lazy(() => import('../components/ui/StatusBadge'))
}

// Animation components lazy loading
export const lazyAnimations = {
  OrbitGallery: lazy(() => import('../components/animations/OrbitGallery')),
  MagneticCard: lazy(() => import('../components/animations/MagneticCard')),
  DepthCarousel: lazy(() => import('../components/animations/DepthCarousel'))
} 