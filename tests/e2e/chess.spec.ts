import { test, expect } from '@playwright/test';

test.describe('Chess Game E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('should display chess board with all pieces', async ({ page }) => {
    // Attendre que l'échiquier soit chargé
    await page.waitForSelector('[data-position="a1"]');

    // Vérifier que les 64 cases sont présentes
    const squares = await page.locator('[data-position]').count();
    expect(squares).toBe(64);

    // Vérifier que les pièces blanches sont présentes
    const whitePieces = await page.locator('.chess-piece.white').count();
    expect(whitePieces).toBe(16);

    // Vérifier que les pièces noires sont présentes
    const blackPieces = await page.locator('.chess-piece.black').count();
    expect(blackPieces).toBe(16);
  });

  test('should move piece by drag and drop', async ({ page }) => {
    // Attendre que l'échiquier soit chargé
    await page.waitForSelector('[data-position="e2"]');

    // Vérifier qu'il y a une pièce en e2
    await expect(page.locator('[data-position="e2"] .chess-piece')).toBeVisible();

    // Drag and drop de e2 à e4 (mouvement de pion valide)
    await page.locator('[data-position="e2"] .chess-piece').dragTo(
      page.locator('[data-position="e4"]')
    );

    // Vérifier que la pièce a été déplacée
    await expect(page.locator('[data-position="e4"] .chess-piece')).toBeVisible();
    await expect(page.locator('[data-position="e2"] .chess-piece')).toBeHidden();
  });

  test('should replace piece when dropped on occupied square', async ({ page }) => {
    // Attendre que l'échiquier soit chargé
    await page.waitForSelector('[data-position="e2"]');

    // Scénario de capture valide:
    // 1. Pion blanc e2 -> e4
    await page.locator('[data-position="e2"] .chess-piece').dragTo(
      page.locator('[data-position="e4"]')
    );
    await page.waitForTimeout(300);

    // 2. Pion noir d7 -> d5
    await page.locator('[data-position="d7"] .chess-piece').dragTo(
      page.locator('[data-position="d5"]')
    );
    await page.waitForTimeout(300);

    // 3. Capture: Pion blanc e4 prend d5
    await page.locator('[data-position="e4"] .chess-piece').dragTo(
      page.locator('[data-position="d5"]')
    );
    await page.waitForTimeout(300);

    // Vérifier que la case d5 contient maintenant le pion blanc
    const pieceAtD5 = page.locator('[data-position="d5"] .chess-piece');
    await expect(pieceAtD5).toBeVisible();
    await expect(pieceAtD5).toHaveClass(/white/);

    // Vérifier que la case e4 est vide
    await expect(page.locator('[data-position="e4"] .chess-piece')).toBeHidden();
  });

  test('should not allow invalid moves', async ({ page }) => {
    // Attendre que l'échiquier soit chargé
    await page.waitForSelector('[data-position="a1"]');

    // Vérifier qu'il y a une tour en a1
    await expect(page.locator('[data-position="a1"] .chess-piece')).toBeVisible();

    // Essayer de déplacer la tour de a1 à a8 (invalide - bloquée par le pion a2)
    await page.locator('[data-position="a1"] .chess-piece').dragTo(
      page.locator('[data-position="a8"]')
    );

    // La pièce devrait rester en a1 (mouvement refusé)
    await expect(page.locator('[data-position="a1"] .chess-piece')).toBeVisible();
  });

  test('should display correct piece symbols', async ({ page }) => {
    // Attendre que l'échiquier soit chargé
    await page.waitForSelector('[data-position="a1"]');

    // Vérifier quelques symboles de pièces
    const whiteRook = await page.locator('[data-position="a1"] .chess-piece').textContent();
    expect(whiteRook).toBe('♖');

    const whiteKnight = await page.locator('[data-position="b1"] .chess-piece').textContent();
    expect(whiteKnight).toBe('♘');

    const blackKing = await page.locator('[data-position="e8"] .chess-piece').textContent();
    expect(blackKing).toBe('♚');
  });

  test('should reset board when reset button is clicked', async ({ page }) => {
    // Attendre que l'échiquier soit chargé
    await page.waitForSelector('[data-position="e2"]');

    // Faire un mouvement
    await page.locator('[data-position="e2"] .chess-piece').dragTo(
      page.locator('[data-position="e4"]')
    );

    // Vérifier que le mouvement a été fait
    await expect(page.locator('[data-position="e4"] .chess-piece')).toBeVisible();
    await expect(page.locator('[data-position="e2"] .chess-piece')).toBeHidden();

    // Cliquer sur le bouton reset
    const resetButton = page.locator('button:has-text("Reset")');
    if (await resetButton.count() > 0) {
      await resetButton.click();
      
      // Vérifier que le pion est revenu en e2
      await expect(page.locator('[data-position="e2"] .chess-piece')).toBeVisible();
      await expect(page.locator('[data-position="e4"] .chess-piece')).toBeHidden();
    }
  });
});