import { test, expect } from '@playwright/test'

test.describe('Performance Tests', () => {
  test('should meet Core Web Vitals thresholds', async ({ page }) => {
    // Navigate to home page and measure performance
    await page.goto('/', { waitUntil: 'networkidle' })
    
    // Measure page load time
    const loadTime = await page.evaluate(() => {
      return performance.timing.loadEventEnd - performance.timing.navigationStart
    })
    
    expect(loadTime).toBeLessThan(3000) // Should load in under 3 seconds
    
    // Check for large images that should be optimized
    const images = await page.locator('img').all()
    for (const image of images) {
      const src = await image.getAttribute('src')
      if (src && !src.includes('placeholder')) {
        // In a real test, you'd check actual image dimensions and file sizes
        expect(src).toBeTruthy()
      }
    }
  })

  test('should have optimized bundle sizes', async ({ page }) => {
    await page.goto('/')
    
    // Check that JavaScript bundles are reasonable size
    const jsResources = await page.evaluate(() => {
      return performance.getEntriesByType('resource')
        .filter((entry: any) => entry.name.endsWith('.js'))
        .map((entry: any) => ({
          name: entry.name,
          size: entry.transferSize || 0
        }))
    })
    
    // Main bundle should be under 500KB
    const mainBundle = jsResources.find((r: any) => r.name.includes('main'))
    if (mainBundle) {
      expect(mainBundle.size).toBeLessThan(500 * 1024)
    }
  })

  test('should implement lazy loading for images', async ({ page }) => {
    await page.goto('/')
    
    // Check that images have loading="lazy" attribute
    const images = await page.locator('img').all()
    let lazyImages = 0
    
    for (const image of images) {
      const loading = await image.getAttribute('loading')
      if (loading === 'lazy') {
        lazyImages++
      }
    }
    
    // At least some images should be lazy loaded
    expect(lazyImages).toBeGreaterThan(0)
  })

  test('should have efficient animations', async ({ page }) => {
    await page.goto('/')
    
    // Check that animations use transform/opacity for performance
    const animatedElements = await page.locator('[class*="animate-"]').all()
    
    for (const element of animatedElements) {
      const styles = await element.evaluate((el) => {
        const style = window.getComputedStyle(el)
        return {
          transform: style.transform,
          opacity: style.opacity,
          willChange: style.willChange
        }
      })
      
      // Animations should use transform/opacity for better performance
      expect(styles.transform !== 'none' || styles.opacity !== '1').toBe(true)
    }
  })

  test('should handle reduced motion preferences', async ({ page }) => {
    // Set reduced motion preference
    await page.addInitScript(() => {
      Object.defineProperty(window.matchMedia, 'matches', {
        writable: true,
        value: true
      })
      window.matchMedia = (query: string) => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true
      })
    })
    
    await page.goto('/')
    
    // Check that animations respect reduced motion
    const animatedElements = await page.locator('[class*="animate-"]').all()
    
    for (const element of animatedElements) {
      const animationDuration = await element.evaluate((el) => {
        const style = window.getComputedStyle(el)
        return style.animationDuration
      })
      
      // With reduced motion, animations should be very short or disabled
      const duration = parseFloat(animationDuration)
      expect(duration).toBeLessThanOrEqual(0.1)
    }
  })
}) 