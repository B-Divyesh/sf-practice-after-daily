import { chromium, expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { dailySeed, targetFor } from '../src/game';

async function finishPracticeRun(page: Page): Promise<void> {
  for (let attempts = 0; attempts < 5; attempts += 1) {
    const choices = page.locator('button[data-action="guess"]:not([disabled])');
    if (await choices.count() === 0) break;
    await choices.first().click();
    if (await page.getByRole('heading', { name: 'You classified the habitat' }).count()) return;
  }
  await expect(page.getByRole('heading', { name: 'You classified the habitat' })).toBeVisible();
}

test('@claim:offline-reload works offline after the first visit', async ({ baseURL }, testInfo) => {
  test.skip(testInfo.project.name !== 'phone', 'The claim uses one dedicated fresh phone browser context.');
  const isolatedBrowser = await chromium.launch({ headless: true });
  const context = await isolatedBrowser.newContext();
  const page = await context.newPage();
  await page.goto(`${baseURL}/demo`);
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null, undefined, { timeout: 12_000 });
  await page.waitForFunction(async () => {
    const cache = await caches.open('signal-garden-shell-v1');
    const entries = await cache.keys();
    return entries.some((entry) => /\/assets\/index-.*\.js$/.test(entry.url)) && entries.some((entry) => /\/assets\/style-.*\.css$/.test(entry.url));
  }, undefined, { timeout: 12_000 });
  await expect(await page.evaluate(async () => (await fetch('/sw.js', { cache: 'reload' })).ok)).toBeTruthy();
  await page.waitForTimeout(1_000);
  await context.setOffline(true);
  await page.reload({ waitUntil: 'commit' });
  await page.waitForTimeout(1_000);
  await expect(page.getByRole('heading', { name: 'Classify this fictional habitat' })).toBeVisible();
  await context.close();
  await isolatedBrowser.close();
});

test('@claim:demo-sandbox starts a labelled sample in isolated storage and resets it', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Classify today’s fictional habitat' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Classify this fictional habitat' })).toBeVisible();
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys.some((key) => key.startsWith('demo:signal-garden:'))).toBeTruthy();
  expect(keys.some((key) => key.startsWith('signal-garden:'))).toBeFalsy();
  await finishPracticeRun(page);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByRole('heading', { name: 'Classify this fictional habitat' })).toBeVisible();
  await expect(page.getByLabel('Guesses remaining')).toContainText('5');
  const afterReset = await page.evaluate(() => Object.keys(localStorage));
  expect(afterReset.some((key) => key.startsWith('signal-garden:'))).toBeFalsy();
});

test('@claim:free-first-release starts the daily game without setup', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Classify this fictional habitat' })).toBeVisible();
  await expect(page.locator('button[data-action="guess"]')).toHaveCount(5);
  await page.locator('button[data-action="guess"]').first().click();
  await expect(page.locator('.feedback, .end-screen')).toBeVisible();
});

test('@claim:reaches-end-screen completes a deterministic practice run', async ({ page }) => {
  await page.goto('/demo');
  await finishPracticeRun(page);
  await expect(page.getByText('Correct answer')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Restart this run' })).toBeVisible();
});

test('a deterministic daily run reaches the loss end screen after three wrong answers', async ({ page }) => {
  const answerName = targetFor(dailySeed()).name;
  await page.goto('/');
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await page.locator('button[data-action="guess"]:not([disabled])').filter({ hasNotText: answerName }).first().click();
  }
  await expect(page.getByRole('heading', { name: 'No guesses left' })).toBeVisible();
  await expect(page.getByText(`The answer was ${answerName}.`)).toBeVisible();
});

test('@claim:restart-resets-state restores a completed run to its first choices', async ({ page }) => {
  await page.goto('/demo');
  await finishPracticeRun(page);
  await page.getByRole('button', { name: 'Restart this run' }).click();
  await expect(page.getByRole('heading', { name: 'Classify this fictional habitat' })).toBeVisible();
  await expect(page.getByLabel('Guesses remaining')).toContainText('5');
  await expect(page.locator('button[data-action="guess"]:not([disabled])')).toHaveCount(5);
});

test('@claim:settings-persist keeps assist mode after a reload', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Settings' }).click();
  const assist = page.getByLabel('Assist mode: show all traits and give five guesses');
  await assist.check();
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.getByText('Signal', { exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Settings' }).click();
  await expect(page.getByLabel('Assist mode: show all traits and give five guesses')).toBeChecked();
});

test('@claim:daily-and-practice-modes offers both daily and no-pressure practice', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Today’s daily puzzle')).toBeVisible();
  await expect(page.getByLabel('Guesses remaining')).toContainText('3');
  await page.getByLabel('Practice seed').fill('copper-rain');
  await page.getByRole('button', { name: 'Start practice' }).click();
  await expect(page.getByText('Practice run', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Guesses remaining')).toContainText('5');
  await expect(page.getByRole('button', { name: /Show a hint/ })).toBeVisible();
});

test('@claim:optional-hints reveal more information without a guess', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('Signal', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: /Show a hint/ }).click();
  await expect(page.getByText('Signal', { exact: true })).toBeVisible();
  await expect(page.getByText('Hint:', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Guesses remaining')).toContainText('5');
});

test('@claim:local-only-progress sends no player data off the product origin', async ({ page, baseURL }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByRole('button', { name: /Show a hint/ }).click();
  await page.locator('button[data-action="guess"]:not([disabled])').first().click();
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: 'Save settings' }).click();
  expect(requests.length).toBeGreaterThan(0);
  expect(requests.every((url) => url.startsWith(baseURL!))).toBeTruthy();
});

test('@claim:60fps-visual-loop keeps the noninteractive visual update above 55 FPS', async ({ page }) => {
  await page.goto('/demo');
  const framesPerSecond = await page.evaluate(() => new Promise<number>((resolve) => {
    let frames = 0;
    const started = performance.now();
    const count = (now: number) => {
      frames += 1;
      if (now - started >= 1000) resolve(frames / ((now - started) / 1000));
      else requestAnimationFrame(count);
    };
    requestAnimationFrame(count);
  }));
  expect(framesPerSecond).toBeGreaterThanOrEqual(55);
});

test('@claim:keyboard-and-touch-controls activates a choice, routes, and the designed 404 page work', async ({ page }, testInfo) => {
  await page.goto('/demo');
  const choice = page.locator('button[data-action="guess"]').first();
  if (testInfo.project.name === 'phone') await choice.tap();
  else { await choice.focus(); await page.keyboard.press('Enter'); }
  await expect(page.locator('.feedback')).toBeVisible();
  await page.goto('/privacy');
  await expect(page).toHaveTitle('Privacy — Practice After Daily');
  await expect(page.getByRole('heading', { name: 'Privacy' })).toBeVisible();
  await page.goto('/terms');
  await expect(page).toHaveTitle('Terms — Practice After Daily');
  await page.goto('/404.html');
  await expect(page).toHaveTitle('Page not found — Practice After Daily');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

test('no serious or critical accessibility violations on the game and legal page', async ({ page }) => {
  for (const path of ['/demo', '/privacy']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page: page as any }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const serious = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
    expect(serious, `${path}: ${serious.map((item) => item.id).join(', ')}`).toEqual([]);
  }
});
