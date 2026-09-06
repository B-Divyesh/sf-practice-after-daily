# Review the daily habitat classification game

## Verdict

**FAIL — 1 minor finding and 1 untested public claim.**

Implementation reviewed:
`4a66e31b058690da9f48511db9d9c546dba143d9`.

Documentation baseline reviewed:
`cae7f959faa1ff2c32de9252b39a3730761dcdbe`.
The commits after the implementation change only `.factory` reports. The live
HTML, JavaScript, and CSS match a clean build of the implementation byte for
byte.

Live URL: <https://practice-after-daily.sociobot.in>.

The job is to classify a fictional habitat, then practise with more guesses
and optional hints. The audience is daily-puzzle players who want to learn
after the shared puzzle. Before scrolling, the first action is **Try it with
sample data**.

## Finding

1. **Minor, untested claim — the README does not state the required intended
   session length and calls the round “short” without a claim test.** The first
   paragraph says the player classifies a habitat in “a short daily round.” It
   gives no time range anywhere in the README. The browser-game contract
   requires an intended session length in the README, and the claims contract
   does not allow an unmeasured adjective in place of a tested number. None of
   the 12 entries in `.factory/claims.json` lists this statement, and no
   `@claim` test measures a round duration. Evidence:
   `/work/.evidence/review-2-session-length-gap.log`. State a numeric intended
   length, add its sandbox test and claim entry, and replace “short” with the
   tested wording.

## First screen and complete game runs

Fresh 1440×900 desktop and Pixel 5 phone browser contexts opened at the top of
the page. Both showed the classification job, named audience, sample action,
and active daily puzzle before scrolling. The game started at 487.92 CSS px in
the 900 px desktop viewport and 604.16 CSS px in the 727 px phone viewport.

One click on **Try it with sample data** opened `/demo`. The persistent **Demo
— sample data, nothing is saved.** label remained visible during play, after
reload, and on the end screen. The `sample-garden` run began with five guesses
and two optional hints.

On desktop, a hint revealed the Signal trait without using a guess. A wrong
answer showed all four trait comparisons and left four guesses. Reload restored
the hint, wrong answer, remaining guesses, and demo label. Enter activated a
second choice. Choosing Dew Ladder reached **You classified the habitat**,
named the correct answer, explained it, and offered **Restart this run**.
Restart restored five enabled choices and five guesses.

On the phone, touch input produced wrong-answer feedback, then Dew Ladder
reached the same win screen. Restart again restored the initial practice state.
A fresh date-based daily run on desktop used three known wrong answers and
reached **No guesses left**. The end screen named Cinder Hollow and explained
the answer. The garden image's accessible name did not reveal it.

Recordings and end screens:

- `/work/.evidence/review-2-live-desktop-run.webm`
- `/work/.evidence/review-2-live-phone-run.webm`
- `/work/.evidence/review-2-live-demo-win.png`
- `/work/.evidence/review-2-live-phone-demo-win.png`
- `/work/.evidence/review-2-live-daily-loss.png`

## Normal, invalid, boundary, and recovery paths

- `!!!` produced an invalid practice seed. Replacing it with `abc` cleared the
  error and started the corrected run without reloading.
- A 24-character seed started normally.
- Reload restored populated demo progress and the persistent demo label.
- **Reset demo** restored the sample run and left the complete real storage
  namespace byte-for-byte unchanged.
- **Start for real** removed every `demo:signal-garden:` key and preserved the
  real-namespace sentinel.
- Light background, assist, movement off, and sound on persisted after reload.
  Movement off computed to `animation-name: none` after render.
- A fresh service-worker-controlled phone context completed an update check,
  found 11 cached shell entries, reloaded `/demo` offline, and remained
  playable.

## Controls and accessibility

- Pointer, touch, Tab, Enter, and Space activated the expected native controls.
- The app skip link moved focus into main content. Settings focused Close,
  wrapped focus in both directions, and returned focus to Settings after Escape.
- Privacy navigation and browser Back focused the new page heading.
- Every measured app and 404 control was at least 44×44 CSS px. The smallest
  measured app dimensions were 44 px by 44 px.
- At 200% text on the 393 px viewport, the document stayed 393 px wide. The
  wordmark and Settings control remained inside the viewport.
- Reduced motion limited the garden animation to one 0.00001-second iteration.
- Axe reported zero WCAG A/AA violations on `/`, `/demo`, `/privacy`, `/terms`,
  the designed missing route, and the open light-theme settings dialog.
- The checked flows produced no unexpected console or page errors.

## Privacy, routes, links, and offline behavior

The observed desktop flow made 27 product requests. Every request was a
same-origin GET. No foreign request, write request, analytics, advertising,
remote database, account, payment, external font, external script, or model
request was observed.

`/`, `/demo`, `/privacy`, and `/terms` returned HTTP 200. `/404.html` returned
200. A fresh missing route returned the designed page with HTTP 404. That
deliberate 404 is expected and is not a defect. Every route had the expected
title and canonical URL, `lang="en"`, one h1, a main landmark, a description,
and a recovery path where needed. Every rendered internal link returned 200.

The worker's `verify-url.sh` passed all six route states. Response headers
included content security, frame, referrer, permissions, and content-type
policies. `robots.txt`, `sitemap.xml`, the manifest, service worker, icons, and
social image returned 200. The sitemap lists all four public app routes.

## Performance and build size

Lighthouse 12.8.2 completed against the live root:

| Category or metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| First contentful paint | 1.16 s |
| Largest contentful paint | 1.16 s |
| Total blocking time | 71.5 ms |
| Cumulative layout shift | 0 |

Three fresh unrecorded live desktop measurements were 60.66, 60.71, and 60.78
FPS. Three fresh unrecorded phone-context measurements were 60.91, 60.70, and
60.65 FPS. All exceed the declared 55 FPS verification-browser threshold.

The build contains 27.82 KB JavaScript and 18.82 KB CSS before gzip, and 9.89
KB JavaScript and 4.79 KB CSS after gzip. It is within the static-game budgets.

## Clean checkout and declared claims

A fresh remote clone at `cae7f959faa1ff2c32de9252b39a3730761dcdbe`
used Node.js 22.23.2 and npm 10.9.8. The documented `npm install`, `npm audit`,
`npm audit --omit=dev`, `npm ci`, and `npm run build` commands passed. Both
audits found zero vulnerabilities, and the build produced `dist/`.

`npm test` passed the isolated phone offline check, then 45 checks with three
intentional desktop skips for phone-only measurements. Each declared claim tag
appears exactly once in the test source.

Every exact command in `.factory/claims.json` was run independently:

| Claim | Result | Evidence |
| --- | --- | --- |
| `demo-sandbox` | Pass | `/work/.evidence/review-2-claims/demo-sandbox.log` |
| `free-first-release` | Pass | `/work/.evidence/review-2-claims/free-first-release.log` |
| `reaches-end-screen` | Pass | `/work/.evidence/review-2-claims/reaches-end-screen.log` |
| `restart-resets-state` | Pass | `/work/.evidence/review-2-claims/restart-resets-state.log` |
| `settings-persist` | Pass | `/work/.evidence/review-2-claims/settings-persist.log` |
| `daily-and-practice-modes` | Pass | `/work/.evidence/review-2-claims/daily-and-practice-modes.log` |
| `optional-hints` | Pass | `/work/.evidence/review-2-claims/optional-hints.log` |
| `deterministic-seeds` | Pass | `/work/.evidence/review-2-claims/deterministic-seeds.log` |
| `local-only-progress` | Pass | `/work/.evidence/review-2-claims/local-only-progress.log` |
| `offline-reload` | Pass | `/work/.evidence/review-2-claims/offline-reload.log` |
| `60fps-visual-loop` | Pass | `/work/.evidence/review-2-claims/60fps-visual-loop.log` |
| `keyboard-pointer-and-touch-controls` | Pass | `/work/.evidence/review-2-claims/keyboard-pointer-and-touch-controls.log` |

The declared claims are true and pass. Finding 1 is a separate public README
claim that is missing from the declaration, leaving the untested claim count at
one.

## Earlier finding disposition

| Earlier finding | Current proof |
| --- | --- |
| Answer leaked in the garden image name | Resolved. The live name is answer-safe during the daily loss. |
| Settings lost focus on Escape | Resolved. Close gets initial focus and Escape returns to Settings. |
| Movement off still animated | Resolved. The live animation name becomes `none`. |
| Unknown URL returned 200 | Resolved. A live missing route returns the designed HTTP 404. |
| Start for real retained demo data | Resolved. It clears every demo key and preserves real data. |
| App phone targets were below 44 px | Resolved. Every measured app target is at least 44×44. |
| Demo used the home title | Resolved. Its title is `Demo — Practice After Daily`. |
| Route canonicals were wrong | Resolved. Demo, Privacy, and Terms use their own URLs. |
| Vite dependency advisories | Resolved. Both audit commands report zero vulnerabilities. |
| Settings claim covered only assist | Resolved. It checks all four settings after reload. |
| Hint claim did not prove two hints | Resolved. It checks exactly two and no guess cost. |
| Deterministic seeds were unlisted | Resolved. The listed test checks daily and practice repeatability. |
| Pointer input was absent from the claim | Resolved. Pointer, keyboard, and touch outcomes are tested. |
| Privacy claim coverage was incomplete | Resolved. Runtime and declared checks cover play, settings, and legal routes. |
| Corrected seed remained invalid | Resolved. `!!!` followed by `abc` starts without reload. |
| Route changes left focus on body | Resolved. Privacy and Back focus their route headings. |
| 404 links were small and skip focus failed | Resolved. Links are at least 44×44 and skip focuses main. |
| 200% phone text clipped navigation | Resolved. No overflow or clipped header control was measured. |

The earlier DNS and deployment blocker remains resolved. The live root returns
HTTPS 200. The brief's cross-player retention measure remains unavailable
because this local-first game has no analytics; the product does not claim that
it can calculate it.

## Checks that do not apply

This is a static, single-player, local-first browser game. Backend tenant
isolation, service restart persistence, health endpoints, 429/Retry-After,
multiplayer rooms, billing, installed-package consumer checks, and live model
requests do not apply. An AI feature would not improve this deterministic
fictional puzzle loop.

## Required next work

Replace “short daily round” with a numeric intended session length in the
README. Add that exact claim to `.factory/claims.json` and add its one matching
outcome test. Then rerun the full suite and the new exact claim command before
requesting another review.

## Evidence

- `/work/.evidence/review-2-live-browser.json`
- `/work/.evidence/review-2-live-desktop-run.webm`
- `/work/.evidence/review-2-live-phone-run.webm`
- `/work/.evidence/review-2-live-desktop-first-screen.png`
- `/work/.evidence/review-2-live-phone-first-screen.png`
- `/work/.evidence/review-2-live-phone-demo-label.png`
- `/work/.evidence/review-2-live-demo-populated.png`
- `/work/.evidence/review-2-live-demo-win.png`
- `/work/.evidence/review-2-live-phone-demo-win.png`
- `/work/.evidence/review-2-live-daily-loss.png`
- `/work/.evidence/review-2-live-phone-text-200.png`
- `/work/.evidence/review-2-live-404-phone.png`
- `/work/.evidence/review-2-lighthouse.json`
- `/work/.evidence/review-2-claim-results.tsv`
- `/work/.evidence/review-2-npm-test.log`
- `/work/.evidence/review-2-npm-build.log`
- `/work/.evidence/review-2-verify-url-live.log`
- `/work/.evidence/review-2-candidate-live-hashes.log`
- `/work/.evidence/review-2-keyboard-live.log`
- `/work/.evidence/review-2-session-length-gap.log`
