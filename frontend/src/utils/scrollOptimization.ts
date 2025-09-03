// Utilitaires pour optimiser le scrolling et améliorer les performances

// Configuration pour le scrolling fluide
export const scrollConfig = {
  // Paramètres pour les animations de scroll
  animation: {
    stiffness: 150,
    damping: 25,
    restDelta: 0.001,
    mass: 0.8
  },
  
  // Paramètres pour le parallaxe
  parallax: {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001
  },
  
  // Paramètres pour les transitions de page
  pageTransition: {
    duration: 0.4,
    ease: [0.25, 0.46, 0.45, 0.94]
  },
  
  // Paramètres pour les sections
  section: {
    duration: 0.6,
    ease: [0.25, 0.46, 0.45, 0.94],
    viewportMargin: "-50px"
  }
};

// Fonction pour optimiser le scrolling avec requestAnimationFrame
export const smoothScrollTo = (targetY: number, duration: number = 1000) => {
  const startY = window.pageYOffset;
  const distance = targetY - startY;
  const startTime = performance.now();

  const easeInOutCubic = (t: number) => {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  };

  const animateScroll = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};

// Fonction pour optimiser les éléments avec will-change
export const optimizeForScroll = (element: HTMLElement) => {
  element.style.willChange = 'transform';
  element.style.transform = 'translateZ(0)';
  element.style.backfaceVisibility = 'hidden';
  element.style.perspective = '1000px';
  element.style.contain = 'layout style paint';
  element.style.isolation = 'isolate';
};

// Fonction pour désactiver l'optimisation après animation
export const cleanupScrollOptimization = (element: HTMLElement) => {
  element.style.willChange = 'auto';
};

// Hook pour détecter la direction du scroll
export const useScrollDirection = () => {
  let lastScrollY = window.pageYOffset;
  let ticking = false;

  const updateScrollDirection = () => {
    const scrollY = window.pageYOffset;
    const direction = scrollY > lastScrollY ? 'down' : 'up';
    lastScrollY = scrollY > 0 ? scrollY : 0;
    ticking = false;
    return direction;
  };

  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollDirection);
      ticking = true;
    }
  };

  return { requestTick };
};

// Fonction pour optimiser les images et éléments lourds
export const optimizeHeavyElements = () => {
  // Optimiser les images avec lazy loading
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src!;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));

  // Optimiser les éléments avec des animations
  const animatedElements = document.querySelectorAll('.smooth-scroll-container, .smooth-section, .parallax-scroll');
  animatedElements.forEach(element => {
    if (element instanceof HTMLElement) {
      optimizeForScroll(element);
    }
  });
};

// Fonction pour désactiver les animations sur les appareils à faible performance
export const shouldReduceMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
         navigator.connection?.effectiveType === 'slow-2g' ||
         navigator.connection?.effectiveType === '2g';
};

// Configuration adaptative basée sur les performances
export const getAdaptiveConfig = () => {
  const isLowPerformance = shouldReduceMotion();
  
  if (isLowPerformance) {
    return {
      ...scrollConfig,
      animation: {
        stiffness: 100,
        damping: 40,
        restDelta: 0.01,
        mass: 1.2
      },
      parallax: {
        stiffness: 150,
        damping: 40,
        restDelta: 0.01
      },
      pageTransition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      },
      section: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
        viewportMargin: "-100px"
      }
    };
  }
  
  return scrollConfig;
};

// Fonction pour optimiser le scroll avec throttle
export const throttleScroll = (func: Function, limit: number) => {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Fonction pour optimiser le scroll avec debounce
export const debounceScroll = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function(this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// Configuration pour les performances de scroll
export const performanceConfig = {
  // Désactiver les animations sur les appareils à faible performance
  disableAnimationsOnLowPerformance: true,
  
  // Utiliser requestAnimationFrame pour les animations
  useRequestAnimationFrame: true,
  
  // Optimiser les éléments avec will-change
  optimizeWithWillChange: true,
  
  // Utiliser des transitions CSS au lieu de JavaScript quand possible
  preferCSSTransitions: true,
  
  // Limiter le nombre d'éléments animés simultanément
  maxSimultaneousAnimations: 10,
  
  // Délai entre les animations pour éviter la surcharge
  animationDelay: 50
};

export default {
  scrollConfig,
  smoothScrollTo,
  optimizeForScroll,
  cleanupScrollOptimization,
  useScrollDirection,
  optimizeHeavyElements,
  shouldReduceMotion,
  getAdaptiveConfig,
  throttleScroll,
  debounceScroll,
  performanceConfig
};
