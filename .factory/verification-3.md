# Verify the daily habitat practice game

## Verdict

**PASS — 0 findings of every severity and 0 untested public claims.**

Implementation reviewed:
`4a66e31b058690da9f48511db9d9c546dba143d9`.

Documentation baseline reviewed:
`7cfec0401eeb8c6fe6e7f680e70228abdf0b00cf`.
The commits after the implementation change only `.factory/handoff.md`. Live
HTML, JavaScript, and CSS match the clean implementation build byte for byte.

Live URL: <https://practice-after-daily.sociobot.in>.

The job is to classify a fictional habitat, then practise with more guesses
and optional hints. It is for daily-puzzle players who want to learn after the
shared puzzle. The first action is **Try it with sample data**.

## Findings

None.

## Live game verification

Fresh 1440×900 desktop and Pixel 5 phone browser contexts opened at the top of
the page. Before scrolling, both showed the job, audience, sample action, and
active daily puzzle. The game itself is on the first screen rather than behind
a menu.

One click on **Try it with sample data** opened `/demo`. The persistent **Demo
— sample data, nothing is saved.** label remained visible during play, after a
reload, and on the end screen. The `sample-garden` run began with five guesses
and two optional hints.

A hint revealed the Signal trait without using a guess. A wrong answer showed
four trait comparisons and left four guesses. Reload restored that populated
state. Choosing Dew Ladder then reached **You classified the habitat** after
two guesses, with its explanation and a real end screen. **Restart this run**
restored five enabled choices and five guesses.

A fresh daily run used three deterministic wrong answers and reached **No
guesses left**. The end screen named Pollen Gate and explained the answer. The
garden image's accessible name did not reveal that answer.

The run recording is `/work/.evidence/verify-3-live-demo-run.webm`. End-screen
evidence is `/work/.evidence/verify-3-live-demo-win.png` and
`/work/.evidence/verify-3-live-daily-loss.png`.

## Normal, invalid, boundary, and recovery paths

- `!!!` produced the seed error. Replacing it with `abc` cleared the error and
  started the corrected run without a reload.
- A 24-character seed started normally.
- Reload restored the sample hint, wrong guess, remaining guesses, and demo
  label.
- **Reset demo** recreated only demo-prefixed state. A real-storage sentinel
  stayed unchanged through play and reset.
- **Start for real** removed every `demo:signal-garden:` key and preserved the
  real-storage sentinel.
- Light background, assist mode, movement off, and sound on all persisted
  after reload. Assist exposed four traits and five guesses. Movement off made
  the stem animation compute to `none`.
- A service-worker-controlled sample reloaded and remained playable after its
  fresh phone context went offline.

The observed sample flow made 12 same-origin GET requests for product files.
It made no foreign request and no write request. Privacy and Terms match the
observed local-only behavior. No account, analytics, advertising, remote
database, payment, or model request was present.

## Controls and accessibility

- Pointer, touch, Tab, Enter, and Space-compatible native controls worked. The
  phone touch path produced visible answer feedback.
- The skip link moved focus into the main game. Settings focused Close, trapped
  reverse Tab, and returned focus to its opener after Escape.
- Privacy navigation and browser Back focused the new page h1 and updated the
  polite route announcement.
- All measured app and static 404 links were at least 44×44 CSS pixels.
- At 200% text on the 393 px phone viewport, the document stayed 393 px wide.
  The wordmark and Settings control remained fully visible.
- With reduced motion, the garden had no looping animation.
- Axe reported zero WCAG A or AA violations on `/`, `/demo`, `/privacy`,
  `/terms`, `/404.html`, and the live unknown route. The open light-theme
  settings dialog also had zero violations.
- All checked flows had zero unexpected console errors or page errors.

The noninteractive visual loop measured 60.88 FPS on desktop and 61.04 FPS in
the Pixel 5 browser context, above the declared 55 FPS threshold. These are
verification-browser measurements, not physical-device benchmarks.

## Routes, links, and performance

`/`, `/demo`, `/privacy`, and `/terms` returned HTTP 200. `/404.html` returned
200. A fresh missing route returned the designed page with HTTP 404; that
deliberate response is expected, not a defect. Every route had its own title
and canonical URL, `lang="en"`, one h1, a main landmark, a description, image
text alternatives, and a recovery path where needed. Navigational internal
links resolved successfully.

The worker's `verify-url.sh` passed on all six route states. Response headers
included the expected content security, frame, referrer, permissions, and
content-type policies. `robots.txt` and `sitemap.xml` were available and the
sitemap listed every public app route.

Lighthouse 12.8.2 completed with no runtime error:

| Category or metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| First contentful paint | 0.90 s |
| Largest contentful paint | 0.94 s |
| Total blocking time | 20.5 ms |
| Cumulative layout shift | 0 |

The build contains 27.82 KB JavaScript and 18.82 KB CSS before gzip, and 9.89
KB JavaScript and 4.79 KB CSS after gzip. It is within the declared static-game
budgets.

## Clean checkout and declared claims

A fresh clone at the documentation baseline used Node.js 22.23.2 and npm
10.9.8. The documented `npm install` completed with zero vulnerabilities.
`npm audit`, `npm audit --omit=dev`, `npm ci`, and `npm run build` passed. The
build produced `dist/`.

`npm test` passed its isolated phone offline check, followed by 45 passing
checks and three intentional desktop skips for phone-only measurements. Every
claim tag appears exactly once in the test source.

Every exact command in `.factory/claims.json` was run independently:

| Claim | Result | Evidence |
| --- | --- | --- |
| `demo-sandbox` | Pass | `/work/.evidence/verify-3-claim-demo-sandbox.log` |
| `free-first-release` | Pass | `/work/.evidence/verify-3-claim-free-first-release.log` |
| `reaches-end-screen` | Pass | `/work/.evidence/verify-3-claim-reaches-end-screen.log` |
| `restart-resets-state` | Pass | `/work/.evidence/verify-3-claim-restart-resets-state.log` |
| `settings-persist` | Pass | `/work/.evidence/verify-3-claim-settings-persist.log` |
| `daily-and-practice-modes` | Pass | `/work/.evidence/verify-3-claim-daily-and-practice-modes.log` |
| `optional-hints` | Pass | `/work/.evidence/verify-3-claim-optional-hints.log` |
| `deterministic-seeds` | Pass | `/work/.evidence/verify-3-claim-deterministic-seeds.log` |
| `local-only-progress` | Pass | `/work/.evidence/verify-3-claim-local-only-progress.log` |
| `offline-reload` | Pass | `/work/.evidence/verify-3-claim-offline-reload.log` |
| `60fps-visual-loop` | Pass | `/work/.evidence/verify-3-claim-60fps-visual-loop.log` |
| `keyboard-pointer-and-touch-controls` | Pass | `/work/.evidence/verify-3-claim-keyboard-pointer-and-touch-controls.log` |

The live page, README, Privacy, Terms, demo documentation, copy audit, design
document, and handoff were cross-checked against the claim list. No public
claim was missing, false, incomplete, or untested.

## Earlier finding disposition

| Earlier finding | Current proof |
| --- | --- |
| Answer leaked in the garden image name | Resolved. The live name is answer-safe, including during the daily loss. |
| Settings lost focus on Escape | Resolved. Close gets initial focus and Escape returns to Settings. |
| Movement off still animated | Resolved. The live animation name is `none`. |
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
| Privacy claim coverage was incomplete | Resolved. Static GET behavior is checked across play and legal routes. |
| Corrected seed remained invalid | Resolved. `!!!` then `abc` starts without reload. |
| Route changes left focus on body | Resolved. Privacy and Back focus their route headings. |
| 404 links were small and skip focus failed | Resolved. Links are 44×44 or larger and skip focuses main. |
| 200% phone text clipped navigation | Resolved. No overflow or clipped header control was measured. |

The earlier DNS and deployment blocker remains resolved. The live root returns
HTTPS 200, and the missing-route response remains HTTPS 404. The brief's
cross-player retention measure is still unavailable because this local-first
game has no analytics; the product does not claim otherwise.

## Not applicable

This is a static, single-player, local-first browser game. Backend tenant
isolation, service restart persistence, health endpoints, 429/Retry-After,
multiplayer rooms, billing, installed-package consumer checks, and live model
requests do not apply. An AI feature would not improve the deterministic
fictional puzzle loop required by the brief.

## Evidence index

- `/work/.evidence/verify-3-live-browser.json`
- `/work/.evidence/verify-3-live-demo-run.webm`
- `/work/.evidence/verify-3-live-desktop-first-screen.png`
- `/work/.evidence/verify-3-live-phone-first-screen.png`
- `/work/.evidence/verify-3-live-demo-populated.png`
- `/work/.evidence/verify-3-live-demo-win.png`
- `/work/.evidence/verify-3-live-daily-loss.png`
- `/work/.evidence/verify-3-live-phone-text-200.png`
- `/work/.evidence/verify-3-live-404-phone.png`
- `/work/.evidence/verify-3-lighthouse.json`
- `/work/.evidence/verify-3-claim-results.tsv`
- `/work/.evidence/verify-3-npm-test.log`
- `/work/.evidence/verify-3-npm-build.log`
- `/work/.evidence/verify-3-verify-url-live.log`
