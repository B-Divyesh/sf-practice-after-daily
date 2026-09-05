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

async function openSettings(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Settings' }).click();
  await expect(page.getByRole('dialog', { name: 'Choose your play settings' })).toBeVisible();
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
  await page.evaluate(() => localStorage.setItem('signal-garden:real-sentinel', 'unchanged'));
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/$/);
  const afterExit = await page.evaluate(() => ({ keys: Object.keys(localStorage), real: localStorage.getItem('signal-garden:real-sentinel') }));
  expect(afterExit.keys.some((key) => key.startsWith('demo:signal-garden:'))).toBeFalsy();
  expect(afterExit.real).toBe('unchanged');
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

test('@claim:settings-persist keeps every play setting after a reload', async ({ page }) => {
  await page.goto('/demo');
  await openSettings(page);
  const light = page.getByLabel('Light background');
  const assist = page.getByLabel('Assist mode: show all traits and give five guesses');
  const motion = page.getByLabel('Gentle garden movement');
  const sound = page.getByLabel('Soft result sound');
  await light.check();
  await assist.check();
  await motion.uncheck();
  await sound.check();
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.getByText('Signal', { exact: true })).toBeVisible();
  await expect(page.locator('.stems i').first()).toHaveCSS('animation-name', 'none');
  await page.reload();
  await openSettings(page);
  await expect(light).toBeChecked();
  await expect(assist).toBeChecked();
  await expect(motion).not.toBeChecked();
  await expect(sound).toBeChecked();
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

test('@claim:optional-hints reveal exactly two more traits without a guess', async ({ page }) => {
  await page.goto('/demo');
  await expect(page.getByText('Signal', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: /Show a hint/ }).click();
  await expect(page.getByText('Signal', { exact: true })).toBeVisible();
  await expect(page.getByText('Hint:', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Show a hint/ }).click();
  await expect(page.getByText('Ground', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /Show a hint/ })).toHaveCount(0);
  await expect(page.getByLabel('Guesses remaining')).toContainText('5');
});

test('@claim:deterministic-seeds keeps daily and named practice runs repeatable', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Play today’s daily' }).click();
  const dailyGoal = page.locator('.puzzle-goal');
  await expect(dailyGoal).toContainText(`Seed: ${dailySeed()}.`);
  const dailyTraits = await page.locator('.traits').innerText();
  await page.reload();
  await expect(dailyGoal).toContainText(`Seed: ${dailySeed()}.`);
  expect(await page.locator('.traits').innerText()).toBe(dailyTraits);
  await page.getByLabel('Practice seed').fill('copper-rain');
  await page.getByRole('button', { name: 'Start practice' }).click();
  await expect(dailyGoal).toContainText('Seed: copper-rain.');
  const practiceTraits = await page.locator('.traits').innerText();
  await page.reload();
  await expect(dailyGoal).toContainText('Seed: copper-rain.');
  expect(await page.locator('.traits').innerText()).toBe(practiceTraits);
});

test('@claim:local-only-progress requests only static product files during play', async ({ page, baseURL }) => {
  const requests: Array<{ url: string; method: string }> = [];
  page.on('request', (request) => requests.push({ url: request.url(), method: request.method() }));
  await page.goto('/');
  await page.goto('/demo');
  await page.getByRole('button', { name: /Show a hint/ }).click();
  await page.locator('button[data-action="guess"]:not([disabled])').first().click();
  await openSettings(page);
  await page.getByRole('button', { name: 'Save settings' }).click();
  await page.goto('/privacy');
  await page.goto('/terms');
  const productOrigin = new URL(baseURL!).origin;
  const permittedPath = (pathname: string) => pathname === '/' || pathname === '/index.html' || pathname === '/demo' || pathname === '/privacy' || pathname === '/terms'
    || pathname === '/sw.js' || pathname === '/manifest.webmanifest' || pathname === '/favicon.svg' || pathname === '/og-signal-garden.svg'
    || pathname === '/apple-touch-icon.png' || pathname === '/404.html' || pathname === '/404.css' || pathname.startsWith('/assets/');
  expect(requests.length).toBeGreaterThan(0);
  expect(requests.every(({ url, method }) => {
    const requestUrl = new URL(url);
    return requestUrl.origin === productOrigin && method === 'GET' && permittedPath(requestUrl.pathname);
  })).toBeTruthy();
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

test('@claim:keyboard-pointer-and-touch-controls activate habitat choices', async ({ page }, testInfo) => {
  await page.goto('/demo');
  const answerName = targetFor('sample-garden').name;
  const choice = page.locator('button[data-action="guess"]').filter({ hasNotText: answerName }).first();
  if (testInfo.project.name === 'phone') await choice.tap();
  else {
    await choice.click();
    await expect(page.locator('.feedback')).toBeVisible();
    await page.reload();
    const keyboardChoice = page.locator('button[data-action="guess"]:not([disabled])').filter({ hasNotText: answerName }).first();
    await keyboardChoice.focus();
    await page.keyboard.press('Enter');
  }
  await expect(page.locator('.feedback')).toBeVisible();
});

test('settings returns keyboard focus to its opener after Escape', async ({ page }) => {
  await page.goto('/demo');
  const opener = page.getByRole('button', { name: 'Settings', exact: true });
  await opener.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Close settings' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(opener).toBeFocused();
});

test('the garden art is named without revealing the hidden answer', async ({ page }) => {
  await page.goto('/');
  const hiddenAnswer = targetFor(dailySeed()).name;
  const art = page.getByRole('img', { name: /Abstract garden mark/ });
  await expect(art).toBeVisible();
  expect(await art.getAttribute('aria-label')).not.toContain(hiddenAnswer);
});

test('the movement setting stops the visible garden animation', async ({ page }) => {
  await page.goto('/demo');
  await openSettings(page);
  await page.getByLabel('Gentle garden movement').uncheck();
  await expect(page.locator('.stems i').first()).toHaveCSS('animation-name', 'none');
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.locator('.stems i').first()).toHaveCSS('animation-name', 'none');
});

test('known routes have their own titles and canonical URLs', async ({ page, baseURL }) => {
  for (const [path, title] of [
    ['/demo', 'Demo — Practice After Daily'],
    ['/privacy', 'Privacy — Practice After Daily'],
    ['/terms', 'Terms — Practice After Daily'],
  ]) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://practice-after-daily.sociobot.in${path}`);
  }
});

test('an unknown path responds with the designed HTTP 404 page', async ({ page }) => {
  const response = await page.goto('/definitely-missing-game-route');
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle('Page not found — Practice After Daily');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

test('phone controls meet the 44 pixel target size', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'phone', 'Touch targets are measured in the phone project.');
  await page.goto('/demo');
  const targets = page.locator('.wordmark, nav a, .nav-settings, .demo-actions button, .demo-actions a, .site-footer a');
  for (let index = 0; index < await targets.count(); index += 1) {
    const box = await targets.nth(index).boundingBox();
    expect(box, `missing target ${index}`).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});

test('route titles and the designed 404 page work', async ({ page }) => {
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
  for (const path of ['/', '/demo', '/privacy', '/terms', '/definitely-missing-game-route']) {
    await page.goto(path);
    const results = await new AxeBuilder({ page: page as any }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const serious = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
    expect(serious, `${path}: ${serious.map((item) => item.id).join(', ')}`).toEqual([]);
  }
});
