# Handoff — Practice After Daily

## Release

Practice After Daily is a static Vite and TypeScript browser game. The active
first screen is the daily Signal Garden classification puzzle. Players can read
fictional traits, choose a habitat, receive trait feedback, and reach a win or
loss screen. Practice is visible on the same page and gives five guesses plus
two optional hints.

Implementation SHA: `194ce19f2371a007de986396c858fbcf6c9ed3a7`.

Documentation verification SHA: recorded by the subsequent report-only handoff
commit; it intentionally differs from the implementation SHA.

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
- After the release commit is pushed, check the HTTPS cold load and record its
  result below without changing product behavior.

## Deployment check

Pending push and factory static deployment at the time this handoff was written.
