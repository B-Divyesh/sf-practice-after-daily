# Handoff — Practice After Daily

## Independent verification 1 — FAIL

Independent QA reviewed implementation
`194ce19f2371a007de986396c858fbcf6c9ed3a7` against documentation baseline
`443576f09dd9001b37e77079e2c8570e5d8cdae5`. The live site now resolves, and
its principal static files match the clean candidate build byte for byte.

The verdict is **FAIL: 14 findings and 5 untested public claims**. Major issues
are an accessible name that reveals the hidden answer, lost focus after closing
Settings, an ineffective movement setting, and unknown URLs returning the game
with HTTP 200 instead of the designed 404. Minor findings cover demo cleanup,
phone target sizes, route title/canonical metadata, a vulnerable development
dependency, and five gaps in declared claim coverage.

All 11 declared claim commands exited 0 from a fresh clone. The complete suite
passed 25 checks, the production build passed, the live win and loss paths were
recorded, live offline reload worked, and the phone browser measured 61.0 FPS.
See `.factory/verification-1.md` for exact evidence and remediation details.

## Release

Practice After Daily is a static Vite and TypeScript browser game. The active
first screen is the daily Signal Garden classification puzzle. Players can read
fictional traits, choose a habitat, receive trait feedback, and reach a win or
loss screen. Practice is visible on the same page and gives five guesses plus
two optional hints.

Implementation SHA: `194ce19f2371a007de986396c858fbcf6c9ed3a7`.

Documentation baseline SHA: `443576f09dd9001b37e77079e2c8570e5d8cdae5`.
This and the later verification-report commit are documentation-only and do not
change the implementation image.

## What changed

- Added a deterministic date-based daily puzzle and player-selected practice
  seeds backed by 24 fictional habitat records.
- Added real win and loss end screens, restart, local recovery after reload,
  assist mode, light mode, motion control, and optional sound.
- Added an isolated `/demo` run with a persistent sample label, Reset demo, and
  distinct `demo:signal-garden:` browser storage.
- Added a service worker that caches the shell and loaded assets for offline
  reload after the first visit.
- Added `/privacy`, `/terms`, a designed static `404.html`, SEO metadata,
  robots, sitemap, PWA manifest, and Static Web Apps security/cache headers.
- Added product-specific CSS/SVG garden marks, documented in `design.md` with
  asset provenance and a reduced-motion path.

## Verification

From the documented Node 22 setup:

```sh
npm install
npm test
npm run build
```

`npm test` passed: one fresh-phone offline reload check plus 24 desktop/phone
browser checks. It covers the demo sandbox, start without setup, deterministic
win and loss end screens, restart, persistent settings, daily and practice
modes, hints, local-only request traffic, keyboard/touch play, route titles,
404, and axe serious/critical violations.

Every command in `.factory/claims.json` was also run independently and passed.
The offline command uses an isolated phone browser context, visits `/demo`,
waits for cached assets, sets the context offline, and reloads the game.

A fresh depth-one checkout was then installed with `npm ci`. Every declared
claim command and `npm run build` passed again from that clean checkout.

The final production build contains 25.59 KB JavaScript (9.30 KB gzip) and
18.51 KB CSS (4.74 KB gzip). `dist/` is produced by `npm run build` and includes
`staticwebapp.config.json`.

`verify-url.sh` passed against `/`, `/demo`, `/privacy`, `/terms`, and
`/404.html`: title, `lang`, exactly one h1, main landmark, image alt attributes,
and no console errors.

Mobile Lighthouse against the built local preview scored 100 performance and
100 accessibility. FCP was 0.9 s, LCP 1.1 s, CLS 0, and total blocking time
40 ms. Playwright measured the visual loop above the declared 55 FPS threshold
on desktop and phone verification browsers.

Fresh desktop (1440×900) and phone (390×844) captures were reviewed. Both show
the job, audience, sample action, and the active daily puzzle before scrolling.
The phone layout stacks field notes above the answer choices. The deterministic
browser run recorded both a practice win and three-wrong-answer daily loss.

## Known gaps and next steps

- Deployment is static and has no backend, account, analytics, payment, or
  external integration. This is deliberate for the local-first v1 scope.
- The researched aggregate retention measure is not collected remotely. Local
  anonymous counters exist, but a privacy-preserving aggregate measurement plan
  would need explicit future product approval.
- The frame-rate claim is measured in the verification browsers, not on a named
  physical mid-range phone.
- The hostname and deployment now work. Unknown live URLs still return the game
  with HTTP 200 instead of the designed 404; see verification finding 4.

## Deployment check

The implementation and documentation baseline were pushed to `origin/main`.
On 2026-09-05, fresh DNS, HTTPS, desktop-browser, and phone-browser checks all
reached the live product. Its principal files hash-match the clean build. The
GitHub Actions API still reports zero workflows and zero runs, so the successful
deployment came from outside this repository's Actions configuration. No
infrastructure was changed during verification.
