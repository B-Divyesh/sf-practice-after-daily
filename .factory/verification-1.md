# Verify the daily habitat practice game — verification 1

## Verdict

**FAIL — 14 findings, including 4 major findings, and 5 untested public claims.**

Candidate implementation: `194ce19f2371a007de986396c858fbcf6c9ed3a7`.

Documentation baseline reviewed: `443576f09dd9001b37e77079e2c8570e5d8cdae5`.
The commits between them change only `.factory/handoff.md`. The deployed
`index.html`, JavaScript, CSS, service worker, and static 404 file match the
clean candidate build byte for byte.

Live URL: <https://practice-after-daily.sociobot.in>.

The job is to classify one fictional habitat, then practise with hints. It is
for daily-puzzle players who want to learn after the shared puzzle. The first
action is **Try it with sample data**, which opens a separate sample run.

## Findings

1. **Major — the accessible image name reveals the answer before a guess.**
   On the live daily run, the game exposes `An abstract garden mark for the
   Pollen Gate habitat.` while Pollen Gate is the hidden answer. A screen-reader
   player receives the solution instead of an equivalent challenge. The label
   was also used to record the deterministic live loss run.
2. **Major — closing Settings loses keyboard focus.** The dialog initially
   focuses its Close button and traps focus, but Escape returns focus to the
   document body instead of the Settings opener. Rendering replaces the opener
   before the stored element is focused.
3. **Major — turning off garden movement does not stop movement.** The setting
   persists as unchecked, but a stem still computes to `sway`, `5.8s`,
   `infinite`, and `running`. The operating-system reduced-motion path does
   work.
4. **Major — an unknown live URL is not a 404.**
   `/definitely-missing-qa-verify-1` returns HTTP 200 and the daily game. It does
   not return the designed 404 page. Direct `/404.html` is designed correctly,
   but does not fix the missing route behavior.
5. **Minor — Start for real does not discard demo data.** The three
   `demo:signal-garden:*` keys remain after leaving `/demo`. Real data was not
   changed, so isolation itself passed.
6. **Minor — several phone touch targets are below 44 CSS pixels.** At the
   tested phone size, Reset demo is 32 px high, Start for real is 21.6 px high,
   the wordmark is 23 px high, and footer links are 19.9 px high. The Play nav
   link is only 37.7 px wide.
7. **Minor — `/demo` has the home page title.** It reports `Practice After
   Daily — Practise a habitat puzzle`, not the required route title `Demo —
   Practice After Daily`.
8. **Minor — route canonical metadata is wrong.** `/demo`, `/privacy`, and
   `/terms` all retain the home canonical URL instead of identifying their own
   route.
9. **Minor — the documented development install has a known vulnerable direct
   dependency.** `npm audit` reports Vite 7.1.12 with five advisories grouped as
   one high-severity dependency finding. `npm audit --omit=dev` reports zero,
   so the deployed static files are not affected.
10. **Minor, untested claim — “Play settings persist” has incomplete declared
    coverage.** Its claim command checks only assist mode, not theme, motion,
    or sound. Manual live QA confirmed all four values persist, but the required
    claim test is incomplete.
11. **Minor, untested claim — “two optional hints” lacks a quantitative claim
    assertion.** The page and README promise two; the declared hint command
    uses only the first hint.
12. **Minor, untested claim — deterministic date and practice seeds are stated
    in README but are not listed and tested as a claim.** Existing tests use a
    deterministic helper but do not assert repeatability for identical seeds.
13. **Minor, untested claim — README advertises keyboard, pointer, and touch for
    one player, while the listed claim covers only keyboard and touch.** Pointer
    clicks worked during QA, but the public claim is not represented completely
    in `.factory/claims.json`.
14. **Minor, untested claim — Privacy states that the product has no analytics,
    advertising, or remote database, but the claim test only rejects off-origin
    requests during part of the demo flow.** It would not detect a same-origin
    analytics or storage endpoint and does not cover every route.

## Live run evidence

- Fresh desktop browser: 1440×900. Fresh phone browser: Playwright Pixel 5,
  393×727 CSS pixels. Both showed the job, audience, sample action, and the
  active puzzle before scrolling. No console or page errors occurred.
- One-click sample: `/` → **Try it with sample data** → `/demo`; the persistent
  label was visible. The `sample-garden` run began with five guesses.
- Populated output: one hint added Signal, a wrong answer showed four semantic
  trait comparisons, reload restored the hint and four remaining guesses, and
  the correct answer produced `You classified the habitat` with an explanation.
- Win evidence: `/work/.evidence/live-demo-win-desktop.png`. The run ended on
  Dew Ladder after two guesses, then Restart restored five choices and five
  guesses.
- Loss evidence: `/work/.evidence/live-daily-loss-desktop.png`. Three known
  wrong daily choices produced `No guesses left`, the Pollen Gate answer,
  explanation, and Restart action.
- Reset removed and recreated only demo-prefixed state. A real-namespace
  sentinel remained `real-unchanged` through sample play, reset, and exit.
- Invalid seed `a!` stayed on the current run and produced a length error. A
  24-character seed started normally. Reload recovery and live offline reload
  both restored a playable sample.
- Keyboard Tab exposed the skip link, Enter moved focus to `main`, Enter chose
  an answer, and Escape closed Settings. Touch chose an answer on the phone.
- With system reduced motion, stem animation became one `0.00001s` iteration.
  The live phone browser measured 61.0 requestAnimationFrame callbacks per
  second.
- Axe found no WCAG A/AA violations on `/`, `/demo`, `/privacy`, `/terms`,
  `/404.html`, or the unknown path. Manual checks found the focus, answer leak,
  motion, and target-size issues above.
- All observed requests during sample play, hint, settings, reload, and exit
  used only `https://practice-after-daily.sociobot.in`.

## Declared claim commands

Every command was run independently after `npm ci` in a fresh clone at the
documentation baseline. Every command exited 0.

| Claim ID | Command result |
| --- | --- |
| `demo-sandbox` | Pass |
| `free-first-release` | Pass |
| `reaches-end-screen` | Pass |
| `restart-resets-state` | Pass |
| `settings-persist` | Pass, but incomplete coverage in finding 10 |
| `daily-and-practice-modes` | Pass |
| `optional-hints` | Pass, but incomplete count coverage in finding 11 |
| `local-only-progress` | Pass |
| `offline-reload` | Pass |
| `60fps-visual-loop` | Pass |
| `keyboard-and-touch-controls` | Pass, but narrower than README in finding 13 |

The complete suite passed: one isolated phone offline check plus 24 desktop and
phone checks. `npm run build` passed and produced `dist/`. Initial JavaScript is
25.59 KB raw and 9.30 KB gzip; CSS is 18.51 KB raw and 4.74 KB gzip.

`verify-url.sh` passed on all five named live routes. Live browser axe checks
reported no violations. Lighthouse wrote a complete mobile report with 100 for
performance, accessibility, best practices, and SEO; FCP and LCP were 1.0 s,
TBT 40 ms, and CLS 0. Its CLI then printed a browser-tab crash, so the scores
are supporting evidence rather than a clean command pass.

## Earlier finding disposition

- **DNS/deployment blocker: resolved.** The hostname resolves and the live root
  returns HTTPS 200. The source repository still has zero GitHub Actions
  workflows and zero workflow runs, but a deployment now exists.
- **Candidate identity: resolved.** Live static files hash-match the clean build
  and later commits before this report are handoff-only.
- **Physical-phone frame-rate gap: unchanged limitation.** This verification
  used a fresh emulated phone browser, not physical mid-range hardware. The
  public claim is scoped to the verification browser and passed at 61.0 FPS.
- **Aggregate retention measure: unchanged limitation.** The privacy-first game
  has local counters but cannot calculate the brief's cross-player success
  measure. This is not represented as a shipped product capability.

No backend, account, multiplayer room, payment path, or AI feature exists, so
tenant isolation, restart persistence, health, 429/Retry-After, billing, and
live model requests are not applicable.

## Evidence index

Machine-readable and visual evidence is under `/work/.evidence/`, including
`claim-results.tsv`, `claims/*.log`, `npm-test.log`, `npm-build.log`,
`live-browser-qa.json`, `live-layout-audit.json`, `live-routes.tsv`,
`live-candidate-sha256.tsv`, `verify-url-live.log`, the live screenshots, and
the Lighthouse JSON.

