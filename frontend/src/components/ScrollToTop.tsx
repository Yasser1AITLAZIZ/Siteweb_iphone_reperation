import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Composant qui remet automatiquement le scroll en haut de page
 * à chaque changement de route
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Scroll vers le haut de la page
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Animation fluide
    })
  }, [pathname]) // Se déclenche à chaque changement de route

  return null // Ce composant ne rend rien visuellement
}
