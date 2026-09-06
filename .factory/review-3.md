# Review the daily habitat classification game

## Verdict

**PASS — 0 findings of every severity and 0 untested public claims.**

Implementation reviewed: `4a66e31b058690da9f48511db9d9c546dba143d9`.

Documentation and test baseline reviewed:
`d732cf0e0a7114aa3db472c7d3e9c43d855f979b`. The difference between these
commits is limited to claims, tests, README, and factory reports; no product
runtime file changed. A clean build of the reviewed baseline has the same
SHA-256 values as live HTML, JavaScript, and CSS.

Live URL: <https://practice-after-daily.sociobot.in>.

The job is to classify a fictional habitat, then practise with more guesses and
optional hints. The audience is daily-puzzle players who want to learn after a
shared challenge. Before scrolling, the first action is **Try it with sample
data**.

## Findings

None.

## Live game and sample run

Fresh 1440×900 desktop and Pixel 5, 393×727, contexts opened at scroll position
zero. Both showed the job, audience, sample action, plain facts, and active
daily puzzle on the first screen. The puzzle began at 539.64 CSS px on desktop
and 647.88 CSS px on the phone, within their 900 px and 727 px viewports.

One click opened `/demo`. It immediately showed the `sample-garden` seed, five
guesses, five named choices, and a hint. The persistent label **Demo — sample
data, nothing is saved.** stayed visible through play, reload, and the win
screen. A hint revealed Signal without a guess cost. A wrong Cinder Hollow
choice produced four trait comparisons and four guesses left. Reload retained
the label, hint, feedback, and count. Dew Ladder reached **You classified the
habitat** with its explanation. The phone touch run reached the same labelled
win screen.

Reset demo recreated sample data while a real-namespace sentinel remained
unchanged. Start for real removed demo keys and retained that sentinel. The
complete restart-reset, invalid-to-valid seed recovery, 24-character seed,
daily loss, keyboard, pointer, touch, and deterministic paths pass in the
clean-run claim suite.

Recorded screenshots and browser results:

- `/work/.evidence/review-3-live-desktop-first-screen.png`
- `/work/.evidence/review-3-live-desktop-demo-populated.png`
- `/work/.evidence/review-3-live-desktop-demo-win.png`
- `/work/.evidence/review-3-live-phone-first-screen.png`
- `/work/.evidence/review-3-live-phone-demo-win.png`
- `/work/.evidence/review-3-live-desktop.json`
- `/work/.evidence/review-3-live-phone.json`

## Claims and clean setup

A clean clone at `d732cf0` passed `npm install`, `npm audit`, `npm audit
--omit=dev`, `npm ci`, `npm run build`, and `npm test`. Both audits found zero
vulnerabilities. The build produced `dist/`. Each of the 13 claim IDs occurs
exactly once in the test source, and every exact command from
`.factory/claims.json` passed independently:

| Claims | Result |
| --- | --- |
| demo sandbox; free first release; daily round duration | Pass |
| reaches end screen; restart resets state; settings persist | Pass |
| daily and practice modes; optional hints; deterministic seeds | Pass |
| local-only progress; offline reload; 60fps visual loop | Pass |
| keyboard, pointer, and touch controls | Pass |

The new two-minute daily-round claim passes, resolving the earlier unmeasured
“short” wording. README, in-game copy, Privacy, Terms, demo documentation,
copy audit, design document, and handoff were checked against the claim list.
No public claim is missing, false, incomplete, or untested.

Claim logs are in `/work/.evidence/review-3-claims/`.

## Accessibility, privacy, routes, and recovery

- `verify-url.sh` passed on `/`, `/demo`, `/privacy`, `/terms`, `/404.html`,
  and a deliberate missing route. The missing route returned the designed HTTP
  404 and is expected behavior.
- Axe found zero WCAG A/AA violations on all six route states and the open demo
  Settings dialog. The results are in `/work/.evidence/review-3-live-axe.json`.
- The Settings dialog initially focused Close; Escape returned focus to Settings.
  Disabling movement computed to `animation-name: none`.
- A live service-worker-controlled demo context had 11 cached entries, persisted
  its four settings, reloaded while offline, and remained playable.
- The inspected live run made 12 requests, all same-origin GETs for static
  product files. It produced no page or console errors.
- Response headers include CSP, HSTS, referrer, permissions, and content-type
  policies. Every public route has its expected title, language, one h1, main
  landmark, canonical URL, and recovery path.

## Earlier finding disposition

All historical findings are resolved and remain covered by current live checks
or declared tests: answer-safe garden art; Settings focus return; movement off;
real HTTP 404; demo-data disposal; 44 px phone targets; demo title; route
canonicals; dependency advisories; complete settings and two-hint claim
coverage; deterministic seed, pointer, and privacy claims; corrected-seed
recovery; route-heading focus; 404 skip and links; 200% phone text; and the
measured two-minute README duration.

The earlier deployment/DNS blocker remains resolved. This product is a static,
single-player, local-first browser game; backend tenant isolation, database
restart persistence, health checks, 429/Retry-After, multiplayer, billing, and
installed-consumer-artifact checks do not apply. No AI feature improves this
deterministic fictional classification loop.

## Evidence

- `/work/.evidence/review-3-live-desktop.json`
- `/work/.evidence/review-3-live-phone.json`
- `/work/.evidence/review-3-live-offline-settings.json`
- `/work/.evidence/review-3-live-focus-motion.json`
- `/work/.evidence/review-3-live-axe.json`
- `/work/.evidence/review-3-claims/`
