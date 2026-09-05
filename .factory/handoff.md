# Handoff — repair the daily habitat practice game

## Result

**PASS — all 4 current findings are resolved. Untested public claims: 0.**

Implementation SHA:
`4a66e31b058690da9f48511db9d9c546dba143d9`.

Documentation verification SHA:
`8efaf1c0581fc5ee9a4709474ae6a363290a30e1`.
The following report-only commit changes only this SHA note. The deployed
product bundle comes from the implementation SHA above.

The live product is <https://practice-after-daily.sociobot.in>.

## What changed

- Practice seed errors now clear when the player edits the input. A valid
  correction starts immediately without a reload.
- Home, Privacy, and Terms links now use the existing history route flow.
  Route changes and Back focus the new page heading and update a stable live
  announcement.
- The static 404 main landmark can receive skip-link focus. Every 404 link is
  at least 44 by 44 CSS pixels.
- The phone header wraps when text is enlarged. At 200% text, the full wordmark
  and Settings control remain visible without horizontal overflow.
- Four browser regressions assert the outcomes above on desktop and phone.

## Current finding disposition

| Verification 2 finding | Disposition |
| --- | --- |
| Corrected seed remains invalid | Resolved. `!!!` reports an error, then `abc` starts its practice run without reload. |
| Route changes leave focus on body | Resolved. Privacy and Back focus their new h1 and update the route live region. |
| 404 links are small and skip focus fails | Resolved. All six links measure at least 44×44, and skip focuses `main`. |
| 200% phone text clips navigation | Resolved. The document stays 393 px wide and the full wordmark and Settings remain visible. |

## Earlier finding disposition

Every Verification 1 finding remains resolved:

| Finding | Current proof |
| --- | --- |
| Garden image reveals the answer | Its accessible name stays answer-safe during a real daily loss. |
| Settings loses focus on Escape | Escape returns focus to the Settings opener. |
| Movement off still animates | The stem animation computes to `none`. |
| Unknown URL returns 200 | A missing route returns the designed HTTP 404. |
| Start for real retains demo data | It removes all demo keys and leaves real storage unchanged. |
| App phone targets are below 44 px | All measured app targets remain at least 44×44. |
| Demo uses the home title | The demo title is `Demo — Practice After Daily`. |
| Route canonicals are wrong | Demo, Privacy, and Terms report their own canonical URLs. |
| Vite has advisories | Both audit commands report zero vulnerabilities. |
| Settings claim is incomplete | Its claim checks theme, assist, motion, and sound after reload. |
| Hint claim does not prove two hints | Its claim checks exactly two hints and no guess cost. |
| Deterministic seeds are unlisted | The declared claim checks daily and practice repeatability. |
| Pointer is missing from input claim | The claim checks pointer, keyboard, and touch outcomes. |
| Privacy claim coverage is incomplete | The claim checks static GET requests across play and legal routes. |

## Clean verification

A separate clean checkout used Node.js 22.23.2 and npm 10.9.8.

```sh
npm ci
npm audit
npm audit --omit=dev
npm run build
npm test
```

All commands passed. The browser suite passed 45 checks. Three desktop checks
were intentionally skipped because they measure the phone layout. The isolated
phone offline test also passed.

Every exact command in `.factory/claims.json` passed independently. All 12
claims have one matching outcome test.

The build contains 27.82 KB JavaScript and 18.82 KB CSS before gzip. It contains
9.89 KB JavaScript and 4.79 KB CSS after gzip.

Local and live URL checks passed for:

- `/`, `/demo`, `/privacy`, and `/terms` with HTTP 200.
- `/404.html` with HTTP 200.
- A fresh missing route with HTTP 404.

Each route has a title, language, one h1, a main landmark, image text
alternatives, and no console errors.

Live axe scans found zero WCAG A or AA violations on all routes. The light
settings state also had zero violations.

The final Lighthouse run completed without a runtime error. It scored 100 for
performance, accessibility, best practices, and SEO. FCP was 0.91 s, LCP was
1.10 s, total blocking time was 20.5 ms, and CLS was 0.

## Live game check

Fresh 1440×900 desktop and 393×727 phone contexts opened at the top. Both showed
the classification job, daily-puzzle audience, sample action, and active game
before scrolling.

One sample click opened the labelled `sample-garden` run. A hint and wrong
answer showed semantic trait feedback and four guesses left. Reload kept the
label and progress. The run then reached **You classified the habitat** for Dew
Ladder after two guesses.

Restart restored five choices and guesses. The invalid seed `!!!` reported
its error. Replacing it with `abc` started the corrected run without reload.
Reset restored only demo data. Start for real removed every demo key while a
real-storage sentinel remained unchanged.

A fresh daily run reached **No guesses left** after three wrong choices. The end
screen named Pollen Gate and explained the answer.

The final live phone document remained 393 px wide at 200% text. The full
wordmark fit, Settings ended at 132.27 px, and every 404 link measured at least
44 px in both dimensions.

Reduced motion limited the stems to one 0.00001-second iteration. The live
visual loop measured 60.34 FPS in the verification browser.

The checked game flow made 12 same-origin requests and no foreign requests.
No console or page errors occurred. Live HTML, JavaScript, and CSS hashes match
the final local build.

## Deployment

The factory reused the product-owned `sf-practice-after-daily` Static Web App
in Central US. Production deployment succeeded, its custom domain remained
ready, and the final cold HTTPS check returned 200.

No backend, shared database, staging slot, payment service, or other product was
read or changed.

## Evidence

- `/work/.evidence/repair-2-live-desktop-first-screen.png`
- `/work/.evidence/repair-2-live-phone-first-screen.png`
- `/work/.evidence/repair-2-live-demo-populated.png`
- `/work/.evidence/repair-2-live-demo-win.png`
- `/work/.evidence/repair-2-live-daily-loss.png`
- `/work/.evidence/repair-2-live-phone-text-200.png`
- `/work/.evidence/repair-2-live-404-phone.png`
- `/work/.evidence/repair-2-lighthouse.json`

## Known limits

- The FPS check uses the verification browser, not a physical mid-range phone.
- The brief's cross-player retention measure remains unavailable. The
  privacy-first game has no remote analytics.
- Backend isolation, restart persistence, health, 429 handling, multiplayer,
  billing, and live model requests do not apply to this static single-player
  game.

No known product defect remains from either independent verification.
