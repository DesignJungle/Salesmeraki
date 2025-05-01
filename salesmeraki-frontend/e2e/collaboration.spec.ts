import { test, expect } from '@playwright/test';

test.describe('Workflow Collaboration', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/auth/signin');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for login to complete
    await page.waitForURL('/dashboard');
  });

  test('should navigate to collaboration page', async ({ page }) => {
    // Go to workflows page
    await page.goto('/workflows');
    
    // Click on the first workflow
    await page.click('text=Edit');
    
    // Click on the collaboration button
    await page.click('text=View Team Collaboration');
    
    // Verify we're on the collaboration page
    await expect(page).toHaveURL(/\/workflows\/.*\/collaboration/);
    await expect(page.locator('h1')).toContainText('Team Collaboration');
  });

  test('should add a comment', async ({ page }) => {
    // Go directly to a workflow collaboration page
    await page.goto('/workflows/123/collaboration');
    
    // Type a comment
    await page.fill('input[placeholder="Add a comment..."]', 'This is a test comment');
    
    // Submit the comment
    await page.click('button:has-text("Post")');
    
    // Verify the comment appears
    await expect(page.locator('text=This is a test comment')).toBeVisible();
  });

  test('should show team members', async ({ page }) => {
    // Go directly to a workflow collaboration page
    await page.goto('/workflows/123/collaboration');
    
    // Verify team members section exists
    await expect(page.locator('h3:has-text("Team Members")')).toBeVisible();
    
    // Check if at least one team member is displayed
    await expect(page.locator('text=John Doe')).toBeVisible();
  });
});