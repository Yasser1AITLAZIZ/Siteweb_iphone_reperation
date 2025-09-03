import { test, expect } from '@playwright/test'

test.describe('Repair Wizard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reparations')
  })

  test('should complete the repair wizard flow', async ({ page }) => {
    // Step 1: Select iPhone model
    await expect(page.getByText('Quel est votre modèle d\'iPhone ?')).toBeVisible()
    await page.click('text=iPhone 15 Pro')
    await expect(page.getByText('Étape 1 sur 5')).toBeVisible()
    
    // Step 2: Select problem type
    await page.click('text=Écran cassé/fissuré')
    await expect(page.getByText('Étape 2 sur 5')).toBeVisible()
    
    // Step 3: Select symptoms
    await page.click('text=Écran noir')
    await page.click('text=Vitre cassée')
    await expect(page.getByText('Étape 3 sur 5')).toBeVisible()
    
    // Step 4: Select contact mode
    await page.click('text=Rendez-vous en atelier')
    await expect(page.getByText('Étape 4 sur 5')).toBeVisible()
    
    // Step 5: Fill contact information
    await page.fill('input[placeholder="Votre nom et prénom"]', 'Ahmed Benali')
    await page.fill('input[placeholder="06 12 34 56 78"]', '+212 6 12 34 56 78')
    await page.fill('input[placeholder="votre@email.com"]', 'ahmed@example.com')
    
    // Submit the form
    await page.click('text=Confirmer la demande')
    
    // Should redirect to confirmation page
    await expect(page.url()).toContain('/reparations/confirmation/')
  })

  test('should show validation errors for incomplete steps', async ({ page }) => {
    // Try to proceed without selecting a model
    await page.click('text=Suivant')
    await expect(page.getByText('Quel est votre modèle d\'iPhone ?')).toBeVisible()
    
    // Select model and try to proceed without selecting problem
    await page.click('text=iPhone 15 Pro')
    await page.click('text=Suivant')
    await expect(page.getByText('Quel est le problème ?')).toBeVisible()
  })

  test('should display price estimates correctly', async ({ page }) => {
    // Select model and problem
    await page.click('text=iPhone 15 Pro')
    await page.click('text=Écran cassé/fissuré')
    await page.click('text=Suivant')
    
    // Check that price estimate is visible
    await expect(page.getByText('89€ - 189€')).toBeVisible()
    await expect(page.getByText('30min - 2h')).toBeVisible()
  })

  test('should handle form navigation correctly', async ({ page }) => {
    // Go to step 2
    await page.click('text=iPhone 15 Pro')
    await page.click('text=Suivant')
    
    // Go back to step 1
    await page.click('text=Précédent')
    await expect(page.getByText('Quel est votre modèle d\'iPhone ?')).toBeVisible()
    
    // Go forward again
    await page.click('text=Suivant')
    await expect(page.getByText('Quel est le problème ?')).toBeVisible()
  })
}) 