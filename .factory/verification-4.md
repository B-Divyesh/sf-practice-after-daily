# Verify the daily habitat classification game

## Verdict

**PASS — 0 findings of every severity and 0 untested public claims.**

Implementation reviewed:
`4a66e31b058690da9f48511db9d9c546dba143d9`.

Documentation and test baseline reviewed:
`01b19bce3e93b21a9b8b5fd5583efcfa77b8e410`.
The changes after the implementation affect tests, claims, README text, and
reports. They do not change the product runtime. A clean build at the
documentation baseline and the live HTML, JavaScript, and CSS have identical
SHA-256 values.

Live URL: <https://practice-after-daily.sociobot.in>.

The job is to classify a fictional habitat, then practise with more guesses
and optional hints. The audience is daily-puzzle players who want to learn
after the shared daily challenge. Before scrolling, the first action is **Try
it with sample data**.

## Findings

None.

## First screen and complete runs

Fresh 1440×900 desktop and Pixel 5, 393×727, browser contexts opened at the top
of the live page. Both showed the job, audience, sample action, three plain
facts, and the active daily game before scrolling. The puzzle began at 487.92
CSS px on desktop and 604.16 CSS px on the phone, inside each viewport.

One click on **Try it with sample data** opened `/demo`. The run immediately
showed the `sample-garden` seed, two field traits, five named choices, five
guesses, and two optional hints. **Demo — sample data, nothing is saved.**
remained visible during play, after reload, and on the end screen.

A hint revealed Signal without costing a guess. A wrong answer produced four
trait comparisons and left four guesses. Reload restored the hint, feedback,
guess count, and demo label. Keyboard input selected another answer. Choosing
Dew Ladder then reached **You classified the habitat**, named the correct
answer, explained it, and offered **Restart this run**. Restart restored five
choices and five guesses.

On the phone, touch input produced wrong-answer feedback and then reached the
same Dew Ladder win screen. A fresh date-based daily run used three wrong
answers and reached **No guesses left** for Cinder Hollow. The daily loss took
212.35 ms of scripted active play, within the stated two-minute design target.

Recorded runs and end screens:

- `/work/.evidence/verification-4-live-desktop-run.webm`
- `/work/.evidence/verification-4-live-phone-run.webm`
- `/work/.evidence/verification-4-live-desktop-demo-win.png`
- `/work/.evidence/verification-4-live-phone-demo-win.png`
- `/work/.evidence/verification-4-live-daily-loss.png`

## Demo isolation and recovery paths

- A real-namespace sentinel remained unchanged through entry, sample play,
  restart, and **Reset demo**.
- Reset removed and recreated only `demo:signal-garden:` data and restored the
  five-guess sample state.
- **Start for real** removed every demo key and retained the real sentinel.
- Reload restored populated demo progress and its persistent sample label.
- `!!!` produced the expected invalid seed state. Replacing it with `abc`
  cleared the error and started the corrected run without a reload.
- A 24-character seed started normally.
- Restart restored the current run. Offline reload restored a playable sample.
- Light background, assist, movement off, and sound on all persisted after
  reload. Movement off computed to `animation-name: none`.

## Claims

A fresh remote checkout at `01b19bc` used Node.js 22.23.2 and npm 10.9.8. The
documented `npm install`, both dependency audits, `npm ci`, `npm run build`, and
`npm test` commands passed. Both audits found zero vulnerabilities. The build
produced `dist/`.

The complete suite passed its isolated phone offline check, then 47 checks
with three intentional desktop skips for phone-only measurements. Each of the
13 claim IDs occurs exactly once as an `@claim` tag. Every exact command in
`.factory/claims.json` was then run independently:

| Claim | Result | Evidence |
| --- | --- | --- |
| `demo-sandbox` | Pass | `/work/.evidence/verification-4-claims/demo-sandbox.log` |
| `free-first-release` | Pass | `/work/.evidence/verification-4-claims/free-first-release.log` |
| `daily-round-duration` | Pass | `/work/.evidence/verification-4-claims/daily-round-duration.log` |
| `reaches-end-screen` | Pass | `/work/.evidence/verification-4-claims/reaches-end-screen.log` |
| `restart-resets-state` | Pass | `/work/.evidence/verification-4-claims/restart-resets-state.log` |
| `settings-persist` | Pass | `/work/.evidence/verification-4-claims/settings-persist.log` |
| `daily-and-practice-modes` | Pass | `/work/.evidence/verification-4-claims/daily-and-practice-modes.log` |
| `optional-hints` | Pass | `/work/.evidence/verification-4-claims/optional-hints.log` |
| `deterministic-seeds` | Pass | `/work/.evidence/verification-4-claims/deterministic-seeds.log` |
| `local-only-progress` | Pass | `/work/.evidence/verification-4-claims/local-only-progress.log` |
| `offline-reload` | Pass | `/work/.evidence/verification-4-claims/offline-reload.log` |
| `60fps-visual-loop` | Pass | `/work/.evidence/verification-4-claims/60fps-visual-loop.log` |
| `keyboard-pointer-and-touch-controls` | Pass | `/work/.evidence/verification-4-claims/keyboard-pointer-and-touch-controls.log` |

The live page, README, Privacy, Terms, demo document, copy audit, design
document, and handoff were checked against the list. No claim-like sentence is
missing, false, incomplete, or untested.

## Accessibility and controls

- Pointer, touch, Tab, Enter, and Space operate the native controls.
- The app skip link moves focus into main content. Settings initially focuses
  Close, traps focus, and returns focus to Settings after Escape.
- Privacy navigation and browser Back focus the new route heading and update
  the route announcement.
- Every measured visible app target on the phone was at least 44×44 CSS px.
- Every 404 link was at least 44 px high. Its skip link focused main.
- At 200% text on a 393 px viewport, the document did not overflow. The
  wordmark and Settings control remained visible.
- Reduced motion used one 0.00001-second animation iteration, not a loop.
- Axe found zero WCAG A/AA violations, including zero serious or critical
  violations, on `/`, `/demo`, `/privacy`, `/terms`, `/404.html`, the live
  missing route, and the open light-theme Settings dialog.
- The hidden Cinder Hollow answer did not appear in the garden image name.
- There was no unexpected console or page error. Chromium emitted one failed
  resource message only for the deliberate HTTP 404 request. That response is
  expected and is not a defect.

## Routes, privacy, and offline use

`/`, `/demo`, `/privacy`, `/terms`, and `/404.html` returned 200. The designed
missing route returned 404. Every route had its expected title, `lang="en"`,
one h1, main landmark, description, canonical URL, and recovery path where
needed. Rendered internal links returned 200.

The worker's URL verifier passed all six route states. Security headers include
content security, frame, referrer, permissions, transport, and content-type
policies. `robots.txt`, `sitemap.xml`, the manifest, service worker, favicon,
touch icon, and social image returned 200. The sitemap lists all four public
app routes.

The recorded live flows made 40 product requests. Every request was a
same-origin GET. There was no analytics, advertising, remote database,
account, payment, external script, external font, or model request. A fresh
phone context gained service-worker control, completed an update check, found
11 cached entries, went offline, reloaded `/demo`, and remained playable.

## Performance and build size

Lighthouse 12.8.2 completed against the live root:

| Category or metric | Result |
| --- | ---: |
| Performance | 92 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| First contentful paint | 1.03 s |
| Largest contentful paint | 1.11 s |
| Total blocking time | 359 ms |
| Cumulative layout shift | 0 |

Three fresh desktop visual-loop measurements were 61.04, 60.18, and 60.99 FPS.
Three fresh phone measurements were 60.66, 60.56, and 60.49 FPS. All exceed
the declared 55 FPS verification-browser threshold.

The build has 27.82 KB JavaScript and 18.82 KB CSS before gzip, and 9.89 KB
JavaScript and 4.79 KB CSS after gzip. It is within the product budgets.

## Earlier finding disposition

| Earlier finding | Current proof |
| --- | --- |
| Answer leaked in the garden image name | Resolved. The live name is answer-safe during the daily loss. |
| Settings lost focus on Escape | Resolved. Close gets initial focus and Escape returns to Settings. |
| Movement off still animated | Resolved. Live computed animation name is `none`. |
| Unknown URL returned 200 | Resolved. The live missing route returns the designed HTTP 404. |
| Start for real retained demo data | Resolved. It clears every demo key and preserves real data. |
| App phone targets were below 44 px | Resolved. Every measured visible app target is at least 44×44. |
| Demo used the home title | Resolved. Its title is `Demo — Practice After Daily`. |
| Route canonicals were wrong | Resolved. Each public route uses its own canonical URL. |
| Vite dependency advisories | Resolved. Both audit commands report zero vulnerabilities. |
| Settings claim covered only assist | Resolved. Its test checks all four settings after reload. |
| Hint claim did not prove two hints | Resolved. Its test checks exactly two and no guess cost. |
| Deterministic seeds were unlisted | Resolved. Its declared test checks daily and practice repeatability. |
| Pointer input was absent from the claim | Resolved. Pointer, keyboard, and touch outcomes are tested. |
| Privacy claim coverage was incomplete | Resolved. Declared and live checks cover play, settings, and legal routes. |
| Corrected seed remained invalid | Resolved. `!!!` followed by `abc` starts without reload. |
| Route changes left focus on body | Resolved. Privacy and Back focus their route headings. |
| 404 links were small and skip focus failed | Resolved. Links are at least 44 px high and skip focuses main. |
| 200% phone text clipped navigation | Resolved. No overflow or clipped header control was measured. |
| README used an unmeasured “short” round | Resolved. README states two minutes or less, and the outcome claim passes. |

The earlier DNS and deployment blocker remains resolved. The live root returns
HTTPS 200, and the runtime files match the candidate build.

## Checks that do not apply

This is a static, single-player, local-first browser game. Backend tenant
isolation, service restart persistence, health endpoints, 429/Retry-After,
multiplayer rooms, billing, and installed consumer-package checks do not apply.
No AI step improves the deterministic fictional classification loop. The
brief's cross-player retention measure cannot be calculated without analytics,
and the product does not claim that it can.

## Evidence

- `/work/.evidence/verification-4-live-browser.json`
- `/work/.evidence/verification-4-earlier-findings.json`
- `/work/.evidence/verification-4-claim-results.tsv`
- `/work/.evidence/verification-4-npm-test.log`
- `/work/.evidence/verification-4-npm-build.log`
- `/work/.evidence/verification-4-verify-url-live.log`
- `/work/.evidence/verification-4-live-candidate-sha256.tsv`
- `/work/.evidence/verification-4-lighthouse.json`
- `/work/.evidence/verification-4-live-headers.txt`
- `/work/.evidence/verification-4-live-assets.tsv`
- `/work/.evidence/verification-4-live-desktop-first-screen.png`
- `/work/.evidence/verification-4-live-phone-first-screen.png`
- `/work/.evidence/verification-4-live-desktop-demo-populated.png`
- `/work/.evidence/verification-4-live-desktop-demo-win.png`
- `/work/.evidence/verification-4-live-phone-demo-win.png`
- `/work/.evidence/verification-4-live-daily-loss.png`
- `/work/.evidence/verification-4-live-404-phone.png`
- `/work/.evidence/verification-4-live-desktop-run.webm`
- `/work/.evidence/verification-4-live-phone-run.webm`
