# Review the daily habitat classification game

## Verdict

**PASS — 0 findings of every severity and 0 untested public claims.**

Implementation reviewed:
`4a66e31b058690da9f48511db9d9c546dba143d9`.

Documentation baseline reviewed:
`fbf505f0aa7ca50a8cf20ed56302c03affb71d87`.
The commits after the implementation change only `.factory` reports. The live
HTML, JavaScript, and CSS match a clean build of the implementation byte for
byte.

Live URL: <https://practice-after-daily.sociobot.in>.

The job is to classify a fictional habitat, then practise with more guesses
and optional hints. The audience is daily-puzzle players who want to learn
after the shared puzzle. The first action is **Try it with sample data**.

## Findings

None.

## First screen and complete game runs

Fresh 1440×900 desktop and Pixel 5 phone browser contexts opened at the top of
the page. Before scrolling, both showed the classification job, the named
audience, the sample action, and the active daily puzzle. The game is on the
first screen rather than behind a menu.

One click on **Try it with sample data** opened `/demo`. The persistent **Demo
— sample data, nothing is saved.** label remained visible during play, after
reload, and on the end screen. The `sample-garden` run began with five guesses
and two optional hints.

A hint revealed the Signal trait without using a guess. A wrong answer showed
four trait comparisons and left four guesses. Reload restored the hint, wrong
answer, remaining guesses, and demo label. Choosing Dew Ladder then reached
**You classified the habitat** after two guesses. The screen named the answer,
gave its explanation, and offered **Restart this run**. Restart restored five
enabled choices and five guesses.

A fresh daily run used three deterministic wrong answers and reached **No
guesses left**. The screen named Pollen Gate and explained it. The hidden
answer was not present in the garden image's accessible name.

The recorded sample run is
`/work/.evidence/review-1-live-demo-run.webm`. End-screen evidence is
`/work/.evidence/review-1-live-demo-win.png` and
`/work/.evidence/review-1-live-daily-loss.png`.

## Normal, invalid, boundary, and recovery checks

- `!!!` produced the practice-seed validation error. Replacing it with `abc`
  cleared the error and started the corrected run without a reload.
- A 24-character seed started normally.
- Reload restored populated sample progress and its label.
- **Reset demo** restored the sample run and changed no real-namespace data.
- **Start for real** removed every `demo:signal-garden:` key and preserved a
  real-namespace sentinel.
- Light background, assist mode, movement off, and sound on persisted after
  reload. Movement off computed to `animation-name: none` after render.
- A service-worker-controlled fresh phone context reloaded `/demo` offline and
  remained playable.

## Controls and accessibility

- Pointer, touch, Tab, Enter, and Space activated the expected native controls.
  The phone touch path produced visible answer feedback.
- The app skip link moved focus into the main game. Settings gave initial focus
  to Close, trapped reverse Tab, and returned focus to Settings after Escape.
- Privacy navigation and browser Back focused the new page heading and updated
  the polite route announcement.
- Every visible app control measured at least 44×44 CSS pixels on the phone.
  Every link on the static 404 also met that size, and its skip link focused
  main.
- At 200% text on the 393 px viewport, the document stayed 393 px wide. The
  wordmark and Settings control remained fully visible.
- Reduced motion limited stem animation to one 0.00001-second iteration, with
  no loop. Turning movement off removed the animation.
- Axe reported zero WCAG A/AA violations on `/`, `/demo`, `/privacy`, `/terms`,
  `/404.html`, and a live missing route. The open light-theme settings dialog
  also had zero violations.
- The reviewed flows had no unexpected console or page errors. Chromium logged
  only the expected failed-document messages for deliberate HTTP 404 checks.

## Privacy, routes, and offline behavior

The reviewed daily game, demo play, settings, legal pages, and recovery paths
made only same-origin GET requests for product files. They made no foreign or
write request. Source inspection and runtime traffic agree with the Privacy
page: there is no account, analytics, advertising, remote database, payment,
or model request.

`/`, `/demo`, `/privacy`, and `/terms` returned HTTP 200. `/404.html` returned
200. A fresh missing route returned the designed page with HTTP 404. That
deliberate 404 is expected and is not a defect. Every route had its own title
and canonical URL, `lang="en"`, one h1, a main landmark, a description, and a
working recovery path. Every rendered internal link returned 200.

The worker's `verify-url.sh` passed on all six route states. Response headers
included content security, frame, referrer, permissions, and content-type
policies. `robots.txt`, `sitemap.xml`, the manifest, icons, and social image
returned 200. The sitemap lists every public app route.

## Performance and build size

Lighthouse 12.8.2 completed against the live root:

| Category or metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| First contentful paint | 1.14 s |
| Largest contentful paint | 1.17 s |
| Total blocking time | 0 ms |
| Cumulative layout shift | 0 |

Three fresh unrecorded live desktop measurements were 60.21, 60.73, and 60.49
FPS. Three fresh unrecorded phone-context measurements were 60.50, 61.02, and
60.16 FPS. All exceed the declared 55 FPS threshold. The long desktop audit
with video capture enabled measured 52.83 FPS; it is not used as frame-rate
evidence because recording was active and the context was not fresh. The exact
claim command passed in fresh desktop and phone test contexts.

The build contains 27.82 KB JavaScript and 18.82 KB CSS before gzip, and 9.87
KB JavaScript and 4.79 KB CSS after gzip. It is within the static-game budgets.

## Clean checkout and declared claims

A fresh clone at `fbf505f` used Node.js 22.23.2 and npm 10.9.8. The documented
`npm install`, `npm audit`, `npm audit --omit=dev`, `npm ci`, and
`npm run build` commands passed. Both audit commands found zero vulnerabilities.
The build produced `dist/`.

`npm test` passed its isolated phone offline check, then 45 checks with three
intentional desktop skips for phone-only measurements. Each claim tag occurs
exactly once in the test source.

Every exact command in `.factory/claims.json` was run independently:

| Claim | Result | Evidence |
| --- | --- | --- |
| `demo-sandbox` | Pass | `/work/.evidence/review-1-claims/demo-sandbox.log` |
| `free-first-release` | Pass | `/work/.evidence/review-1-claims/free-first-release.log` |
| `reaches-end-screen` | Pass | `/work/.evidence/review-1-claims/reaches-end-screen.log` |
| `restart-resets-state` | Pass | `/work/.evidence/review-1-claims/restart-resets-state.log` |
| `settings-persist` | Pass | `/work/.evidence/review-1-claims/settings-persist.log` |
| `daily-and-practice-modes` | Pass | `/work/.evidence/review-1-claims/daily-and-practice-modes.log` |
| `optional-hints` | Pass | `/work/.evidence/review-1-claims/optional-hints.log` |
| `deterministic-seeds` | Pass | `/work/.evidence/review-1-claims/deterministic-seeds.log` |
| `local-only-progress` | Pass | `/work/.evidence/review-1-claims/local-only-progress.log` |
| `offline-reload` | Pass | `/work/.evidence/review-1-claims/offline-reload.log` |
| `60fps-visual-loop` | Pass | `/work/.evidence/review-1-claims/60fps-visual-loop.log` |
| `keyboard-pointer-and-touch-controls` | Pass | `/work/.evidence/review-1-claims/keyboard-pointer-and-touch-controls.log` |

The live page, README, Privacy, Terms, demo document, copy audit, design
document, and handoff were cross-checked against the list. No public claim is
missing, false, incomplete, or untested.

## Earlier finding disposition

| Earlier finding | Current proof |
| --- | --- |
| Answer leaked in the garden image name | Resolved. The live name is answer-safe, including during the daily loss. |
| Settings lost focus on Escape | Resolved. Close gets initial focus and Escape returns to Settings. |
| Movement off still animated | Resolved. The live animation name becomes `none`. |
| Unknown URL returned 200 | Resolved. A live missing route returns the designed HTTP 404. |
| Start for real retained demo data | Resolved. It clears every demo key and preserves real data. |
| App phone targets were below 44 px | Resolved. Every measured app target is at least 44×44. |
| Demo used the home title | Resolved. Its title is `Demo — Practice After Daily`. |
| Route canonicals were wrong | Resolved. Demo, Privacy, and Terms use their own URLs. |
| Vite dependency advisories | Resolved. Both audit commands report zero vulnerabilities. |
| Settings claim covered only assist | Resolved. It checks all four settings after reload. |
| Hint claim did not prove two hints | Resolved. It checks exactly two hints and no guess cost. |
| Deterministic seeds were unlisted | Resolved. The listed test checks daily and practice repeatability. |
| Pointer input was absent from the claim | Resolved. Pointer, keyboard, and touch outcomes are tested. |
| Privacy claim coverage was incomplete | Resolved. Runtime and declared checks cover play, settings, and legal routes. |
| Corrected seed remained invalid | Resolved. `!!!` followed by `abc` starts without reload. |
| Route changes left focus on body | Resolved. Privacy and Back focus their route headings. |
| 404 links were small and skip focus failed | Resolved. Links are 44×44 or larger and skip focuses main. |
| 200% phone text clipped navigation | Resolved. No overflow or clipped header control was measured. |

The earlier DNS and deployment blocker remains resolved. The live root returns
HTTPS 200, and the missing-route response remains HTTPS 404. The brief's
cross-player retention measure is unavailable because this local-first game
has no analytics; the product does not claim otherwise.

## Checks that do not apply

This is a static, single-player, local-first browser game. Backend tenant
isolation, service restart persistence, health endpoints, 429/Retry-After,
multiplayer rooms, billing, installed-package consumer checks, and live model
requests do not apply. An AI feature would not improve the deterministic
fictional puzzle loop required by the brief.

## Evidence

- `/work/.evidence/review-1-live-browser.json`
- `/work/.evidence/review-1-live-demo-run.webm`
- `/work/.evidence/review-1-live-desktop-first-screen.png`
- `/work/.evidence/review-1-live-phone-first-screen.png`
- `/work/.evidence/review-1-live-demo-populated.png`
- `/work/.evidence/review-1-live-demo-win.png`
- `/work/.evidence/review-1-live-daily-loss.png`
- `/work/.evidence/review-1-live-phone-text-200.png`
- `/work/.evidence/review-1-live-404-phone.png`
- `/work/.evidence/review-1-live-fps.json`
- `/work/.evidence/review-1-lighthouse.json`
- `/work/.evidence/review-1-claim-results.tsv`
- `/work/.evidence/review-1-npm-test.log`
- `/work/.evidence/review-1-npm-build.log`
- `/work/.evidence/review-1-verify-url-live.log`
- `/work/.evidence/review-1-live-candidate-sha256.tsv`
