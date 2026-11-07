const { test, expect } = require('@playwright/test');
const taskCases = require('../test-data/tasks.json');

const APP_URL = 'https://create-asana-like-pr-39y5.bolt.host/';
const EMAIL = process.env.APP_EMAIL || 'admin';
const PASSWORD = process.env.APP_PASSWORD || 'password123';

async function login(page) {
  await page.goto(APP_URL);

  const email = page.getByLabel(/email|username/i).first();
  const password = page.getByLabel(/password/i).first();

  if (await email.count()) {
    await email.fill(EMAIL);
  } else if (await page.getByPlaceholder(/email|username/i).count()) {
    await page.getByPlaceholder(/email|username/i).first().fill(EMAIL);
  } else {
    await page.locator('input').nth(0).fill(EMAIL);
  }

  if (await password.count()) {
    await password.fill(PASSWORD);
  } else if (await page.getByPlaceholder(/password/i).count()) {
    await page.getByPlaceholder(/password/i).first().fill(PASSWORD);
  } else {
    await page.locator('input[type="password"]').first().fill(PASSWORD);
  }

  const loginButton = page.getByRole('button', { name: /log ?in|sign ?in/i }).first();
  if (await loginButton.count()) {
    await loginButton.click();
  } else {
    await page.locator('button[type="submit"]').first().click();
  }

  await expect(page.getByText('Web Application', { exact: true }).first())
    .toBeVisible({ timeout: 15000 });
}

test.describe('Asana-like task board - data-driven checks', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  for (const scenario of taskCases) {
    test(scenario.name, async ({ page }) => {
      // Open the project required by this JSON scenario.
      await page.getByText(scenario.project, { exact: true }).first().click();

      // Find the task by its exact title.
      const task = page.getByText(scenario.task, { exact: true }).first();
      await expect(task).toBeVisible();

      // Find the nearest ancestor that contains the task and every expected
      // tag. On a board UI this should normally be the task card.
      const tagConditions = scenario.tags
        .map(tag => `contains(normalize-space(.), "${tag}")`)
        .join(' and ');
      const taskCard = task.locator(
        `xpath=ancestor::*[${tagConditions}][1]`
      );

      await expect(taskCard).toBeVisible();

      // Confirm the expected column is in the task's ancestor chain.
      // This checks the task's placement, rather than merely checking that
      // a column with that name exists somewhere on the page.
      const columnAncestor = task.locator(
        `xpath=ancestor::*[contains(normalize-space(.), "${scenario.column}")][1]`
      );
      await expect(columnAncestor).toBeVisible();

      // Scope tag assertions to the task card so another task cannot
      // accidentally satisfy the expected tags.
      for (const tag of scenario.tags) {
        await expect(taskCard.getByText(tag, { exact: true })).toBeVisible();
      }
    });
  }
});
