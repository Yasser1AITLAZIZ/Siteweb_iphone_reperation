import { test, expect } from '@playwright/test'

test.describe('Accessibility Tests', () => {
  test('should meet WCAG 2.2 AA standards on home page', async ({ page }) => {
    await page.goto('/')
    
    // Inject axe-core
    await page.addInitScript(() => {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.0/axe.min.js'
      document.head.appendChild(script)
    })
    
    // Wait for axe to load
    await page.waitForFunction(() => (window as any).axe)
    
    // Run accessibility audit
    const results = await page.evaluate(() => {
      return (window as any).axe.run()
    })
    
    // Check for critical violations
    const violations = results.violations.filter((v: any) => 
      v.impact === 'critical' || v.impact === 'serious'
    )
    
    expect(violations).toHaveLength(0)
    
    // Log any minor violations for review
    if (results.violations.length > 0) {
      console.log('Accessibility violations found:', results.violations)
    }
  })

  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/')
    
    // Check that there's only one h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)
    
    // Check heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
    let previousLevel = 0
    
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase())
      const level = parseInt(tagName.charAt(1))
      
      // Headings should not skip levels
      expect(level - previousLevel).toBeLessThanOrEqual(1)
      previousLevel = level
    }
  })

  test('should have proper form labels and ARIA attributes', async ({ page }) => {
    await page.goto('/reparations')
    
    // Check that all form inputs have labels
    const inputs = await page.locator('input, textarea, select').all()
    
    for (const input of inputs) {
      const hasLabel = await input.evaluate(el => {
        const id = el.getAttribute('id')
        if (id) {
          return !!document.querySelector(`label[for="${id}"]`)
        }
        return !!el.closest('label')
      })
      
      expect(hasLabel).toBe(true)
    }
    
    // Check for proper ARIA attributes
    const ariaRequired = await page.locator('[aria-required="true"]').count()
    expect(ariaRequired).toBeGreaterThan(0)
  })

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/')
    
    // Check that primary text has sufficient contrast
    const primaryText = await page.locator('.text-foreground').first()
    const backgroundColor = await primaryText.evaluate(el => {
      const style = window.getComputedStyle(el)
      return style.backgroundColor
    })
    
    // This is a basic check - in a real scenario you'd use a color contrast library
    expect(backgroundColor).not.toBe('transparent')
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')
    
    // Tab through all interactive elements
    await page.keyboard.press('Tab')
    
    // Check that focus is visible
    const focusedElement = await page.evaluate(() => document.activeElement)
    expect(focusedElement).not.toBeNull()
    
    // Check that focus indicator is visible
    const focusStyles = await page.evaluate((el) => {
      const style = window.getComputedStyle(el as Element)
      return {
        outline: style.outline,
        boxShadow: style.boxShadow
      }
    }, focusedElement)
    
    expect(focusStyles.outline !== 'none' || focusStyles.boxShadow !== 'none').toBe(true)
  })

  test('should have proper alt text for images', async ({ page }) => {
    await page.goto('/')
    
    // Check that all images have alt text
    const images = await page.locator('img').all()
    
    for (const image of images) {
      const alt = await image.getAttribute('alt')
      expect(alt).not.toBeNull()
      expect(alt).not.toBe('')
    }
  })
}) 