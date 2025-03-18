import { test, expect, Page, Route } from '@playwright/test';

test.describe('Workflow Builder', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Mock authentication
    await page.route('**/api/auth/session', async (route: Route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          user: { id: 'user-1', name: 'Test User' },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        })
      });
    });
    
    // Navigate to workflows page
    await page.goto('/workflows');
  });

  test('should create a new workflow', async ({ page }: { page: Page }) => {
    // Mock API response for workflow creation
    await page.route('**/api/workflows', async (route: Route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          id: 'test-workflow-id',
          name: 'E2E Test Workflow',
          description: 'Created by E2E test',
          status: 'draft',
          steps: []
        })
      });
    });
    
    // Click create new workflow button
    await page.getByText('Create Workflow').click();
    
    // Fill in workflow details
    await page.getByLabel('Workflow Name').fill('E2E Test Workflow');
    await page.getByLabel('Description').fill('Created by E2E test');
    
    // Add a step
    await page.getByText('Add Step').click();
    await page.getByText('Email').click();
    
    // Save workflow
    await page.getByText('Save Workflow').click();
    
    // Verify success message
    await expect(page.getByText('Workflow saved successfully')).toBeVisible();
  });
});
