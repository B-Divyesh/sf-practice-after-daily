# Handoff — verify the daily habitat practice game

## Verification result

**FAIL — 4 findings: 1 major and 3 minor. Untested public claims: 0.**

Independent verification reviewed implementation
`9610c041e22e9dbcc9000ca330f9e326a11791a6` and documentation baseline
`ffdd1245f6ff30ff65941fcc7cdf9d37dd401e05`. Product code was not changed.
The live HTML, JavaScript, and CSS match the clean candidate build.

The blocking issue is practice-seed recovery: after `!!!` creates a custom
validation error, replacing it with valid `abc` does not clear the error or
start the run. Three minor accessibility issues remain: route changes leave
focus on the body, static 404 links are below 44 px and its skip link does not
move focus, and 200% phone text makes the header 9 px wider than the viewport.

See `.factory/verification-2.md` for exact reproduction evidence and the full
disposition of all 14 earlier findings.

## What passed

- Fresh checkout: `npm ci`, documented `npm install`, `npm audit`,
  `npm audit --omit=dev`, `npm run build`, and `npm test`.
- Full browser suite: 40 passing checks and one intentional desktop skip for a
  phone-only measurement.
- All 12 exact claim commands in `.factory/claims.json`; zero untested public
  claims remain.
- Live sample label, semantic feedback, reload recovery, win, restart, reset,
  demo cleanup, and real-storage isolation.
- Live daily keyboard loss, answer-safe art name, settings focus return,
  persisted settings, movement off, reduced motion, touch input, and ordinary
  app touch targets.
- Live route statuses, titles, canonicals, internal links, legal pages, designed
  HTTP 404, same-origin requests, offline reload, and no console errors.
- Axe on dark and light states found no WCAG A/AA violations.
- Lighthouse completed with 100 in performance, accessibility, best practices,
  and SEO. FCP and LCP were 1.0 s, TBT 50 ms, and CLS 0.
- Live visual-loop measurements were 60.50 FPS desktop and 60.76 FPS phone.

## Run the verification

From a clean checkout with Node.js 22 or later:

```sh
npm ci
npm audit
npm audit --omit=dev
npm run build
npm test
```

Run every `test` command in `.factory/claims.json` separately. Check the live
routes with:

```sh
./verify-url.sh https://practice-after-daily.sociobot.in/ 200
./verify-url.sh https://practice-after-daily.sociobot.in/demo 200
./verify-url.sh https://practice-after-daily.sociobot.in/privacy 200
./verify-url.sh https://practice-after-daily.sociobot.in/terms 200
./verify-url.sh https://practice-after-daily.sociobot.in/404.html 200
./verify-url.sh https://practice-after-daily.sociobot.in/a-missing-route 404
```

## Next work

Repair the four findings without weakening the existing claim coverage. Add
regression checks for corrected seed input, route focus, the 404’s complete
touch and skip-link behavior, and 200% text reflow. Then deploy the new product
bundle and request a fresh independent verification.

Evidence is under `/work/.evidence/`. The required machine-readable result is
`/work/.evidence/qa-result.json`.
