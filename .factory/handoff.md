# Handoff — session-length repair

## Result

**PASS — the current review finding is resolved.**

Live product: <https://practice-after-daily.sociobot.in>.

Implementation SHA: 4a66e31b058690da9f48511db9d9c546dba143d9. That remains the last product HTML, JavaScript, and CSS change. The repaired claim test was added in 4c4e15d8b14bfaedb4e3e79ccdc3d0cff03a6f20; the documentation/claim baseline is 2029a7f6c2aedb6a7855d74a3208b218a30e47af. The later handoff commit records verification only. A clean local build and live HTML, JavaScript, and CSS have identical SHA-256 values, so no new product image was needed for these documentation and test-only commits.

## What changed

- README now gives the intended numeric session length: “A daily round is designed to reach its win or loss screen in two minutes or less.” It no longer calls a round “short.”
- .factory/claims.json declares that exact public claim as daily-round-duration.
- Its one outcome test opens a fresh daily game, makes three deterministic choices, waits for the real loss end screen, and measures active-game elapsed time at no more than 120,000 milliseconds. It does not inspect source text.

## Verification

From the documented clean setup with Node.js 22.23.2 and npm 10.9.8:

    npm install
    npm audit
    npm audit --omit=dev
    npm ci
    npm run build
    npm test

Both audits reported zero vulnerabilities. npm run build completed and made dist/ with 27.82 KB JavaScript (9.89 KB gzip) and 18.82 KB CSS (4.79 KB gzip). npm test passed its isolated phone offline check, then 47 checks with three intentional desktop-only phone-measurement skips. The exact new command also passed after its final wording update:

    npm test -- --grep @claim:daily-round-duration

All 13 exact commands declared in .factory/claims.json were run independently on the repair build and passed. Every declared ID occurs exactly once as an @claim: tag. This includes demo isolation, no-account start, daily duration, win end screen, restart, settings, modes, hints, deterministic seeds, local-only traffic, offline reload, visual-loop FPS, and keyboard/pointer/touch.

Live HTTPS checks passed:

    ./verify-url.sh https://practice-after-daily.sociobot.in/
    ./verify-url.sh https://practice-after-daily.sociobot.in/demo
    ./verify-url.sh https://practice-after-daily.sociobot.in/privacy
    ./verify-url.sh https://practice-after-daily.sociobot.in/terms
    ./verify-url.sh https://practice-after-daily.sociobot.in/404.html
    ./verify-url.sh https://practice-after-daily.sociobot.in/repair-3-deliberate-missing-route 404

The first five routes returned 200. The designed missing page returned its expected 404, not a product error. Every check found a title, lang, one h1, a main landmark, image alternatives, and no console errors.

Fresh live desktop (1440×900) and Pixel 5 (393×727) contexts both started at scroll position zero. Before scrolling they showed the job (“Classify this fictional habitat”), the audience (daily-puzzle players learning after a shared challenge), the first action (Try it with sample data), and the game itself. The puzzle began at 539.64 px on desktop and 647.88 px on the phone, inside each viewport.

Both contexts entered /demo in one action, retained “Demo — sample data, nothing is saved.”, produced trait feedback after a wrong choice, then reached the Dew Ladder win screen. Reset demo recreated only demo keys and retained a real-storage sentinel; Start for real discarded all demo keys and retained that sentinel. A fresh daily desktop run deliberately lost against Cinder Hollow and displayed its loss end screen.

Live request recording found only same-origin GET requests. The route, demo, legal pages, missing page, and open settings dialog had zero axe serious or critical violations. Offline reload succeeded in a fresh service-worker-controlled phone context. Keyboard Enter chose a habitat; Settings returned focus after Escape; the skip link focused main. At 200% text the phone page did not overflow and all measured targets were at least 44×44 CSS pixels. Reduced motion rendered a single 0.00001-second animation iteration, not a loop. Fresh requestAnimationFrame measurements were 60.55 FPS desktop and 61.26 FPS phone, above the declared 55 FPS threshold.

## Earlier finding disposition

All earlier findings remain resolved and were retained by the full regression suite and live checks: answer-safe garden name; settings Escape focus; movement off; designed missing-route 404; demo-data deletion on exit; 44 px app and 404 targets; route-specific title and canonical; audit-free Vite dependency; complete settings, hint, seed, input, and privacy claims; corrected invalid seed recovery; route-change focus; 404 skip focus; and 200% phone header reflow. The only current review finding—the unmeasured “short” round—was resolved by the numeric README claim and duration outcome test above.

## Scope and known limits

This is a static, single-player, local-first browser game. Backend tenant isolation, health, restart persistence, rate limits, multiplayer, billing, and consumer-install checks do not apply. The brief’s aggregate retention measure cannot be computed without analytics; the product does not claim it can. No AI feature is appropriate for this deterministic fictional puzzle loop.

## Evidence

- /work/.evidence/repair-3-live-browser.json
- /work/.evidence/repair-3-live-desktop-first-screen.png
- /work/.evidence/repair-3-live-phone-first-screen.png
- /work/.evidence/repair-3-live-desktop-demo-win.png
- /work/.evidence/repair-3-live-phone-demo-win.png
- /work/.evidence/repair-3-live-daily-loss.png
- /work/.evidence/catalog-description.txt
