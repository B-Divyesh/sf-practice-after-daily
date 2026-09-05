# Handoff — Practice After Daily repair 1

## Release

Practice After Daily is a local-first browser game for daily-puzzle players who
want to learn after the shared puzzle. Players classify a fictional habitat from
traits, receive comparison feedback, and can immediately begin an open practice
run with two hints and five guesses.

Implementation SHA: `9610c041e22e9dbcc9000ca330f9e326a11791a6`.

This SHA was built and deployed. Any later handoff/report commit is
documentation and verification tooling only.

## Repair outcome

All 14 findings from verification 1 are resolved.

| Earlier finding | Current disposition |
| --- | --- |
| Art accessibility label revealed the answer | Fixed. The garden mark describes a current fictional habitat without naming the hidden answer; browser regression checks the actual daily answer is absent. |
| Settings lost focus on Escape | Fixed. Closing focuses the newly rendered Settings opener; keyboard regression covers dialog entry and Escape return. |
| Movement setting still animated stems | Fixed. The root motion state disables stem animation with `animation: none`; checked live and in the browser suite. |
| Unknown URL returned the game with 200 | Fixed. Only `/demo`, `/privacy`, and `/terms` rewrite to the app; unknown live URLs return the styled 404 with HTTP 404. |
| Start for real retained sample data | Fixed. Leaving demo removes every `demo:signal-garden:` key and keeps real storage untouched. |
| Phone targets below 44 px | Fixed. Header, demo, and footer controls are measured at least 44×44 CSS px in the phone suite. |
| Demo title was home title | Fixed: `Demo — Practice After Daily`. |
| Route canonicals stayed at `/` | Fixed for demo, privacy, and terms. |
| Vulnerable Vite development dependency | Fixed by updating Vite to 7.3.6; `npm audit` reports zero vulnerabilities. |
| Settings claim covered assist only | Fixed. The claim tests light background, assist, garden movement, and sound after reload. |
| Hints claim did not check two | Fixed. It requests both hints, sees both new traits, and confirms no third hint action. |
| Repeatable seed statement lacked a claim | Fixed with the `deterministic-seeds` claim. |
| Pointer input missing from input claim | Fixed: the input claim now covers desktop pointer, keyboard, and phone touch. |
| Privacy request check was incomplete | Fixed. It records the daily game, demo, hint, settings, privacy, and terms, accepting only GETs for known static product files. |

The earlier deployment/DNS blocker is also resolved. The product remains a
static local-first game: backend tenant isolation, restart persistence, health,
429, payment, and entitlement checks do not apply.

## Verification

From a new clone of the implementation SHA at
`/tmp/practice-after-daily-clean-9610c04`:

```sh
npm ci
npm run build
npm test
```

All commands passed. `npm test` passed 40 browser checks; one desktop instance
of the phone-only touch-target measurement is intentionally skipped. All 12
commands declared in `.factory/claims.json` were separately invoked from that
same clean clone and passed. `npm audit` and `npm audit --omit=dev` both report
zero vulnerabilities.

The production build is 27.09 KB JavaScript (9.63 KB gzip) and 18.78 KB CSS
(4.79 KB gzip). It is below the static initial-JS and CSS budgets. The browser
suite runs axe on `/`, `/demo`, `/privacy`, `/terms`, and the designed unknown
route; it found no serious or critical WCAG A/AA violations. The isolated demo
offline-reload check passes. The visual loop claim still measures at least 55
FPS in the verification browser.

`verify-url.sh` passed locally and live for `/`, `/demo`, `/privacy`, `/terms`,
`/404.html`, and an unknown URL with expected HTTP 404. It checks title, lang,
one h1, main, image alt attributes, and console errors while treating the
deliberate 404 navigation as expected.

Lighthouse could not complete in this container: its Chrome tab crashed even
when pointed at Playwright Chromium. This is a measurement-tool limitation, not
a passing Lighthouse result; the build budgets and browser accessibility checks
above are the current performance evidence.

## Live check

On 2026-09-05, `/opt/fleet/lib/deploy-static.sh practice-after-daily dist`
reused the existing one-replica static product site in Central US and completed
the production upload. HTTPS serves the deployed `index-CpQ8tiy9.js` bundle.

A fresh desktop and Pixel 5 browser opened the live root at scroll position 0.
Before scrolling, both showed the job (**Classify today’s fictional habitat**),
audience (daily-puzzle players learning after a shared challenge), first action
(**Try it with sample data**), and the active daily puzzle.

The live sample run showed its persistent sample label, a hint, four semantic
feedback rows, and four guesses left after one wrong choice. It reached a win
screen, restarted to five available choices and five guesses, then reset and
left demo mode with zero demo keys while a real-storage sentinel remained
unchanged. A live daily run reached the loss screen; its Pollen Gate answer was
not present in the garden mark’s accessible name. Settings initially focused
Close, Escape returned focus to Settings, and turning movement off computed to
`animation-name: none`. The live demo, privacy, and terms titles/canonicals all
match their URLs. The unknown live URL returns the designed page with HTTP 404.

Evidence images are in `/work/.evidence/repair-1-live-desktop.png`,
`repair-1-live-phone.png`, `repair-1-live-demo-win.png`, and
`repair-1-live-daily-loss.png`. The plain verb-first catalogue description was
copied to `/work/.evidence/catalog-description.txt`.

## Remaining limitations

- The FPS check uses the verification browser, not a named physical mid-range
  phone.
- No remote analytics collect the brief’s aggregate retention measure. Local
  counters remain privacy-first, so the cross-player success metric is not
  calculated.
- There is no backend, account, payment, external provider, or paid offer in
  this free v1, so no billing metadata is required.
