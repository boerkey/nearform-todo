import { test, expect } from '@playwright/test';

test.describe('Todo app', () => {
  test.beforeEach(async ({ request }) => {
    const res = await request.get('http://localhost:3001/todos');
    const todos = (await res.json()) as { id: string }[];
    for (const t of todos) {
      await request.delete(`http://localhost:3001/todos/${t.id}`);
    }
  });

  test('shows empty state', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('empty-state')).toBeVisible();
  });

  test('creates a todo and lists it', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('New todo').fill('Buy milk');
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText('Buy milk')).toBeVisible();
    await expect(page.getByTestId('empty-state')).not.toBeVisible();
  });

  test('shows validation for empty submit via client', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('New todo').fill('   ');
    await page.getByRole('button', { name: 'Add' }).click();
    await expect(page.getByText(/cannot be empty/i)).toBeVisible();
  });

  test('toggles complete and deletes', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('New todo').fill('Task one');
    await page.getByRole('button', { name: 'Add' }).click();
    const checkbox = page.getByRole('checkbox', { name: /Task one/ });
    // Controlled input: checked state updates only after PATCH returns — avoid `.check()` (sync assert).
    await Promise.all([
      page.waitForResponse((r) => r.request().method() === 'PATCH' && r.url().includes('/todos/') && r.ok()),
      checkbox.click(),
    ]);
    await expect(checkbox).toBeChecked();
    await expect(page.locator('span').filter({ hasText: 'Task one' })).toHaveCSS('text-decoration', /line-through/);
    await page.getByRole('button', { name: /Delete Task one/ }).click();
    await expect(page.getByTestId('empty-state')).toBeVisible();
  });
});
