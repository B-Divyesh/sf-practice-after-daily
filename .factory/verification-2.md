# Verify the daily habitat practice game

## Verdict

**FAIL — 4 findings: 1 major and 3 minor. There are 0 untested public claims.**

Implementation reviewed: `9610c041e22e9dbcc9000ca330f9e326a11791a6`.

Documentation baseline reviewed: `ffdd1245f6ff30ff65941fcc7cdf9d37dd401e05`.
That later commit changes reports and the URL checker, not the deployed product
bundle. The live HTML, JavaScript, and CSS match the clean build of the
implementation candidate byte for byte.

Live URL: <https://practice-after-daily.sociobot.in>.

The job is to classify a fictional habitat, then practise with more guesses and
optional hints. It is for daily-puzzle players who want to learn after the
shared puzzle. The first action is **Try it with sample data**.

## Findings

1. **Major — a corrected practice seed stays invalid after one validation
   error.** On the live `/demo` page, entering `!!!` and pressing **Start
   practice** correctly reports “Enter at least three letters, numbers, or
   dashes.” Replacing it with the valid seed `abc` leaves `validity.valid` false
   with the same message. Pressing **Start practice** again does nothing and the
   run remains `sample-garden`. Reloading is the only recovery. The custom
   validity is cleared only inside the submit handler, but the browser does not
   dispatch that handler while the stored custom error exists. This blocks a
   core practice path after a common input mistake.
2. **Minor — route changes do not move focus to the new page heading.** Clicking
   the header Privacy link leaves focus on `BODY`; Back also leaves focus on
   `BODY`. The checked-in `navigate()` helper and polite route announcement are
   not connected to links, so navigation uses a full document load instead of
   the required history and focus behavior. URLs, titles, Back, and page content
   otherwise work.
3. **Minor — the real 404 page has undersized links and a skip link that does
   not move focus.** In a fresh Pixel 5 browser on a live unknown URL, the
   wordmark is 171×19 CSS px, header Privacy is 58×19, footer Privacy is 49×16,
   and footer Terms is 40×16. Each is below the 44 px touch-target baseline.
   Activating **Skip to page content** sets `#main`, but focus remains on
   `BODY` because the static 404 main element is not focusable. The 404 response
   itself is correct and is not a defect.
4. **Minor — 200% text size clips the phone navigation.** With root text size
   increased from 16 to 32 px in a 393 px viewport, the document becomes 402 px
   wide. The Settings control extends 9 px beyond the viewport. The game remains
   playable, but the header does not meet the requirement to resize text to
   200% without loss or horizontal overflow.

## Live game evidence

- Fresh desktop (1440×900) and emulated Pixel 5 (393×727 CSS px) contexts opened
  at scroll position zero. Both showed **Classify today’s fictional habitat**,
  the daily-puzzle audience, **Try it with sample data**, and the active puzzle
  before scrolling.
- One click opened `/demo` with the persistent **Demo — sample data, nothing is
  saved.** label, the `sample-garden` seed, five guesses, and two hints.
- One hint and a wrong answer produced four trait comparisons and four guesses
  remaining. Reload restored that state. The deterministic run then reached
  **You classified the habitat** for Dew Ladder after two guesses.
- **Restart this run** restored five enabled choices and five guesses. A valid
  24-character boundary seed started normally. The invalid-then-corrected path
  failed as finding 1 describes.
- Reset recreated only `demo:signal-garden:` state. **Start for real** removed
  every demo key while a `signal-garden:` sentinel remained unchanged.
- A fresh daily run used keyboard input for three known wrong answers and
  reached **No guesses left** for Pollen Gate. Its garden image name did not
  contain the hidden answer.
- Settings initially focused Close. Escape returned focus to Settings. Light
  background, assist, movement off, and sound persisted after reload. Movement
  off computed to `animation-name: none`.
- System reduced motion limited the stem animation to one 0.00001-second
  iteration. The live requestAnimationFrame check measured 60.50 FPS on desktop
  and 60.76 FPS in the phone browser.
- The ordinary phone app controls measured at least 44×44 CSS px. Finding 3 is
  limited to the separate static 404 page.

Screenshots:

- `/work/.evidence/verify-2-live-desktop-first-screen.png`
- `/work/.evidence/verify-2-live-phone-first-screen.png`
- `/work/.evidence/verify-2-live-demo-label-phone.png`
- `/work/.evidence/verify-2-live-demo-populated.png`
- `/work/.evidence/verify-2-live-demo-win.png`
- `/work/.evidence/verify-2-live-daily-loss.png`
- `/work/.evidence/verify-2-live-404-phone.png`
- `/work/.evidence/verify-2-live-phone-text-200.png`

## Clean checkout and claims

A fresh clone at the documentation baseline used Node 22.23.2 and npm 10.9.8.
Both the documented `npm install` and reproducible `npm ci` setup completed with
zero audit findings. `npm run build` produced `dist/`. The full `npm test` run
passed 40 checks, with one intentional desktop skip for the phone-only target
measurement.

Every exact command in `.factory/claims.json` was then run separately. Every
claim has exactly one matching `@claim:<id>` test.

| Claim | Result |
| --- | --- |
| `demo-sandbox` | Pass |
| `free-first-release` | Pass |
| `reaches-end-screen` | Pass |
| `restart-resets-state` | Pass |
| `settings-persist` | Pass |
| `daily-and-practice-modes` | Pass |
| `optional-hints` | Pass |
| `deterministic-seeds` | Pass |
| `local-only-progress` | Pass |
| `offline-reload` | Pass |
| `60fps-visual-loop` | Pass |
| `keyboard-pointer-and-touch-controls` | Pass |

The live page, README, privacy page, terms page, demo documentation, and handoff
were cross-checked against the claim list. No public claim is missing a declared
test, so the untested claim count is zero. The invalid recovery defect is an
untested required path, not an unlisted public claim.

## Routes, accessibility, privacy, and performance

- `/`, `/demo`, `/privacy`, and `/terms` return 200. A fresh unknown path
  returns the designed page with HTTP 404. Direct `/404.html` returns 200.
- Titles, canonical URLs, `lang`, one h1, main landmarks, and console checks
  pass on every route. All rendered internal links return 200.
- `verify-url.sh` passes on the four app routes, direct 404 page, and unknown URL
  with expected status 404.
- Playwright axe reports no WCAG A/AA violations on the four app routes, direct
  404 page, or unknown route. The light game and open light-theme settings
  dialog also report none. Manual keyboard, focus, touch-target, and resize
  checks found findings 2–4, which automated axe did not report.
- Observed play, settings, privacy, terms, and offline requests were same-origin
  GETs for product files. No analytics, advertising, remote database, account,
  payment, external script, or external font request was observed. Live offline
  reload restored the sample game after service-worker control.
- Lighthouse 12.8.2 completed against the live root with 100 performance, 100
  accessibility, 100 best practices, and 100 SEO. FCP and LCP were 1.0 s, TBT
  was 50 ms, and CLS was 0. The JSON is
  `/work/.evidence/verify-2-lighthouse.json`.
- The build contains 27.09 KB JavaScript and 18.78 KB CSS before gzip, below the
  required budgets. The initial HTML, JavaScript, and CSS hashes match live.

This is a static, single-player, local-first game. Backend tenant isolation,
restart persistence, health, 429/Retry-After, multiplayer rooms, billing, and
live model requests do not apply. No AI feature is needed for the deterministic
fictional puzzle loop. The brief’s cross-player retention measure remains
unavailable because the product deliberately has no remote analytics.

## Earlier finding disposition

| Verification 1 finding | Current disposition |
| --- | --- |
| Answer leaked in the garden image name | Resolved. The live name is answer-safe, and the daily loss confirms the hidden answer separately. |
| Settings lost focus on Escape | Resolved. Close gets initial focus and Escape returns to Settings after render. |
| Movement off still animated | Resolved. Live computed animation name is `none`. |
| Unknown URL returned 200 | Resolved. A live unknown URL returns the designed HTTP 404. |
| Start for real retained demo data | Resolved. All demo keys are removed and real data stays unchanged. |
| Phone targets below 44 px | Resolved for the previously named app controls. The separate static 404 has the new finding 3. |
| Demo used the home title | Resolved. The live title is `Demo — Practice After Daily`. |
| Route canonicals were wrong | Resolved for demo, privacy, and terms. |
| Vite dependency advisories | Resolved. Both audit commands report zero vulnerabilities. |
| Settings claim covered only assist | Resolved. The declared test covers all four settings. |
| Hint claim did not prove two hints | Resolved. The declared test proves exactly two and no guess cost. |
| Deterministic seeds were unlisted | Resolved with a declared repeatability claim and test. |
| Pointer input was absent from the claim | Resolved. Pointer, keyboard, and touch are tested. |
| Privacy claim coverage was incomplete | Resolved. The declared test covers daily, demo, play, settings, privacy, and terms requests. |

The earlier DNS and deployment blocker remains resolved. The earlier physical
phone limitation also remains: this run used a fresh emulated phone browser,
and the FPS claim is correctly limited to the verification browser.

## Required next work

Clear the seed input’s custom validity on input or before validation, then add
an invalid-to-valid recovery test. Connect route links to the existing history
and focus behavior. Make every 404 link a 44 px target and make its skip target
focusable. Reflow or collapse the phone navigation at 200% text size. After
repair, rerun the full suite, every claim command, and the four failed manual
paths before requesting another independent verification.
