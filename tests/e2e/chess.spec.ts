import { test, expect, Page } from '@playwright/test';

test.describe('Chess Game E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display chess board with all pieces', async ({ page }) => {
    // Vérifier le titre
    await expect(page.locator('h1')).toHaveText('Jeu d\'Échecs');
    
    // Vérifier le plateau (64 cases)
    const squares = page.locator('.board-square');
    await expect(squares).toHaveCount(64);
    
    // Vérifier qu'il y a 32 pièces
    const pieces = page.locator('.chess-piece');
    await expect(pieces).toHaveCount(32);
    
    // Vérifier quelques pièces spécifiques
    await expect(page.locator('[data-position="e1"] .chess-piece')).toContainText('♔'); // Roi blanc
    await expect(page.locator('[data-position="d8"] .chess-piece')).toContainText('♛'); // Reine noire
  });

  test('should move piece by drag and drop', async ({ page }) => {
    // Déplacer un pion blanc de a2 à a4
    const pawnA2 = page.locator('[data-position="a2"] .chess-piece');
    const squareA4 = page.locator('[data-position="a4"]');
    
    await pawnA2.dragTo(squareA4);
    
    // Vérifier que le pion est maintenant en a4
    await expect(page.locator('[data-position="a4"] .chess-piece')).toBeVisible();
    await expect(page.locator('[data-position="a2"] .chess-piece')).toBeHidden();
    
    // Vérifier l'historique
    const historyItems = page.locator('.move-history li');
    await expect(historyItems).toHaveCount(1);
    await expect(historyItems.first()).toContainText('a2 → a4');
  });

  test('should replace piece when dropped on occupied square', async ({ page }) => {
    // Prendre une pièce noire pour vérifier qu'elle est visible
    const blackRookA8 = page.locator('[data-position="a8"] .chess-piece');
    await expect(blackRookA8).toBeVisible();
    
    // Déplacer la tour blanche de a1 vers a8 (remplacer la tour noire)
    const whiteRookA1 = page.locator('[data-position="a1"] .chess-piece');
    const squareA8 = page.locator('[data-position="a8"]');
    
    await whiteRookA1.dragTo(squareA8);
    
    // Vérifier que la case a8 contient maintenant la tour blanche
    await expect(page.locator('[data-position="a8"] .chess-piece')).toBeVisible();
    await expect(page.locator('[data-position="a1"] .chess-piece')).toBeHidden();
    
    // La tour noire devrait avoir disparu
    // (on ne peut pas vérifier directement car elle a été remplacée)
  });

  test('should update move history', async ({ page }) => {
    const historyContainer = page.locator('.move-history');
    await expect(historyContainer).toBeVisible();
    
    // Faire plusieurs mouvements
    await page.locator('[data-position="b1"] .chess-piece').dragTo(page.locator('[data-position="c3"]'));
    await page.locator('[data-position="g8"] .chess-piece').dragTo(page.locator('[data-position="f6"]'));
    await page.locator('[data-position="e2"] .chess-piece').dragTo(page.locator('[data-position="e4"]'));
    
    // Vérifier l'historique
    const historyItems = page.locator('.move-history li');
    await expect(historyItems).toHaveCount(3);
    
    // Vérifier le contenu des entrées d'historique
    const firstMove = historyItems.nth(0);
    await expect(firstMove).toContainText('b1 → c3');
    
    const lastMove = historyItems.nth(2);
    await expect(lastMove).toContainText('e2 → e4');
  });

  test('should reset board when reset button is clicked', async ({ page }) => {
    // Faire quelques mouvements
    await page.locator('[data-position="a2"] .chess-piece').dragTo(page.locator('[data-position="a4"]'));
    await page.locator('[data-position="h7"] .chess-piece').dragTo(page.locator('[data-position="h5"]'));
    
    // Vérifier que l'historique n'est pas vide
    let historyItems = page.locator('.move-history li');
    await expect(historyItems).toHaveCount(2);
    
    // Cliquer sur le bouton de réinitialisation
    const resetButton = page.locator('button.reset-btn');
    await expect(resetButton).toBeVisible();
    await resetButton.click();
    
    // Vérifier que l'historique est vide
    historyItems = page.locator('.move-history li');
    await expect(historyItems).toHaveCount(0);
    
    // Vérifier que les pièces sont revenues à leurs positions initiales
    await expect(page.locator('[data-position="a2"] .chess-piece')).toBeVisible();
    await expect(page.locator('[data-position="h7"] .chess-piece')).toBeVisible();
    await expect(page.locator('[data-position="a4"] .chess-piece')).toBeHidden();
    await expect(page.locator('[data-position="h5"] .chess-piece')).toBeHidden();
  });

  test('should maintain visual feedback during drag and drop', async ({ page }) => {
    const pawn = page.locator('[data-position="e2"] .chess-piece');
    const targetSquare = page.locator('[data-position="e4"]');
    
    // Commencer le drag
    await pawn.dragTo(targetSquare);
    
    // Vérifier que la pièce est bien déplacée
    await expect(page.locator('[data-position="e4"] .chess-piece')).toBeVisible();
  });
});