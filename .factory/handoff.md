# Handoff — independent verification 4

## Result

**PASS — 0 findings of every severity and 0 untested public claims.**

The full report is in `.factory/verification-4.md`. The live product is
<https://practice-after-daily.sociobot.in>.

Implementation reviewed:
`4a66e31b058690da9f48511db9d9c546dba143d9`.

Documentation and test baseline reviewed:
`01b19bce3e93b21a9b8b5fd5583efcfa77b8e410`.
Later changes before this handoff affect claims, tests, README text, and reports,
not the product runtime. Live HTML, JavaScript, and CSS match the clean baseline
build byte for byte.

## What was verified

- Fresh live desktop and Pixel 5 contexts showed the job, audience, sample
  action, and active game before scrolling.
- Recorded sample runs reached the Dew Ladder win screen with the persistent
  demo label. A fresh daily run reached the Cinder Hollow loss screen.
- Demo reset and exit changed no real-namespace data.
- Normal, invalid, 24-character boundary, reload, restart, update, and offline
  recovery paths passed.
- Keyboard, pointer, touch, focus, reduced motion, 200% text, phone targets,
  route titles, links, legal pages, the designed 404, and live axe checks passed.
- Live traffic consisted only of same-origin GET requests.
- Three fresh measurements on each viewport exceeded 60 FPS.
- Lighthouse scored 92 performance and 100 for accessibility, best practices,
  and SEO. LCP was 1.11 seconds and CLS was 0.
- `npm install`, `npm audit`, `npm audit --omit=dev`, `npm ci`, `npm run build`,
  and `npm test` passed from a fresh remote checkout.
- Every one of the 13 claim commands passed independently. Each claim ID has
  exactly one matching test.
- Every earlier verification and review finding, including the repaired
  two-minute session-length claim, is resolved.

## How to verify

```sh
npm install
npm audit
npm audit --omit=dev
npm ci
npm run build
npm test
```

Run each `test` command in `.factory/claims.json` independently. Check the live
routes with:

```sh
./verify-url.sh https://practice-after-daily.sociobot.in/
./verify-url.sh https://practice-after-daily.sociobot.in/demo
./verify-url.sh https://practice-after-daily.sociobot.in/privacy
./verify-url.sh https://practice-after-daily.sociobot.in/terms
./verify-url.sh https://practice-after-daily.sociobot.in/404.html
./verify-url.sh https://practice-after-daily.sociobot.in/a-deliberate-missing-route 404
```

## Known limits

This is a static, single-player, local-first game. Backend, database,
multiplayer, billing, and installed-package checks do not apply. The FPS result
uses fresh emulated desktop and phone browsers, not physical phone hardware.
The product has no analytics, so it cannot calculate the brief's aggregate
retention measure and does not claim to do so.

Evidence is under `/work/.evidence/` with the `verification-4-` prefix.
