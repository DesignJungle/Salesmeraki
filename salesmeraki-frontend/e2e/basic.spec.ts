import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/SalesMeraki/);
});

test('login flow works', async ({ page }) => {
  await page.goto('/login');
  // Test login functionality
});