import { chromium } from '@playwright/test';

const url = process.argv[2];
const expectedStatus = Number(process.argv[3] ?? 200);
if (!url) {
  console.error('Usage: node scripts/verify-url.mjs http://127.0.0.1:4173/');
  process.exit(2);
}
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
page.on('console', (message) => {
  const isExpectedNotFound = expectedStatus === 404 && message.text() === 'Failed to load resource: the server responded with a status of 404 (Not Found)';
  if (message.type() === 'error' && !isExpectedNotFound) errors.push(message.text());
});
page.on('pageerror', (error) => errors.push(error.message));
const response = await page.goto(url, { waitUntil: 'networkidle' });
if (response?.status() !== expectedStatus) errors.push(`Navigation status: ${response?.status() ?? 'no response'}; expected ${expectedStatus}`);
const checks = await page.evaluate(() => ({
  lang: document.documentElement.lang,
  title: document.title,
  main: Boolean(document.querySelector('main')),
  h1s: document.querySelectorAll('h1').length,
  unlabeledImages: [...document.images].filter((image) => !image.hasAttribute('alt')).map((image) => image.src),
}));
await browser.close();
if (!checks.lang || !checks.title || !checks.main || checks.h1s !== 1 || checks.unlabeledImages.length || errors.length) {
  console.error(JSON.stringify({ checks, errors }, null, 2));
  process.exit(1);
}
console.log(`Verified ${url}: HTTP ${expectedStatus}, title, lang, one h1, main, image alt attributes, and no console errors.`);
