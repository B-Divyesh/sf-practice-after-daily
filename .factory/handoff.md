# Handoff — strict product review 2

## Result

**FAIL — 1 minor finding and 1 untested public claim.**

Implementation reviewed:
`4a66e31b058690da9f48511db9d9c546dba143d9`.

Documentation baseline reviewed:
`cae7f959faa1ff2c32de9252b39a3730761dcdbe`.
Only report files changed after the implementation. The live HTML, JavaScript,
and CSS match the clean implementation build byte for byte.

Live product: <https://practice-after-daily.sociobot.in>.

The full review is in [`.factory/review-2.md`](review-2.md).

## What was reviewed

- Fresh desktop and Pixel 5 phone browsers showed the classification job,
  audience, sample action, and active game before scrolling.
- Recorded desktop and phone sample runs reached the Dew Ladder win screen. A
  date-based desktop run reached the Cinder Hollow loss screen. Restart reset
  both sample runs.
- The one-click sample stayed labelled, showed populated trait feedback,
  recovered after reload, reset safely, and did not change real data.
- Invalid-to-valid seed recovery, the 24-character boundary, all settings,
  keyboard, pointer, touch, dialog focus, route focus, 200% text, reduced
  motion, offline update/reload, links, legal pages, and the designed 404 passed.
- Axe found zero serious or critical issues. Lighthouse scored 100 in all four
  categories. Six fresh FPS measurements exceeded 60 FPS.
- All 12 declared claim commands passed independently. Every earlier review and
  verification finding remains resolved.

The release still fails because the README calls a round “short” but gives no
numeric intended session length. The browser-game contract requires that
length, and the public statement has no claim entry or test.

No product code was changed during this review.

## How to verify

From a clean checkout with Node.js 22 or later:

```sh
npm install
npm audit
npm audit --omit=dev
npm ci
npm run build
npm test
```

Run every exact command in `.factory/claims.json` independently. For live route
checks:

```sh
./verify-url.sh https://practice-after-daily.sociobot.in/
./verify-url.sh https://practice-after-daily.sociobot.in/demo
./verify-url.sh https://practice-after-daily.sociobot.in/privacy
./verify-url.sh https://practice-after-daily.sociobot.in/terms
./verify-url.sh https://practice-after-daily.sociobot.in/404.html
./verify-url.sh https://practice-after-daily.sociobot.in/review-2-fresh-missing-route 404
```

The full suite passed its isolated phone offline check, then 45 checks with
three intentional desktop skips for phone-only measurements. The build is
27.82 KB JavaScript and 18.82 KB CSS before gzip.

## Performance and evidence

Fresh live measurements ranged from 60.66–60.78 FPS on desktop and 60.65–60.91
FPS in the phone context. Lighthouse measured FCP 1.16 s, LCP 1.16 s, TBT 71.5
ms, and CLS 0.

Review evidence is under `/work/.evidence/` with the `review-2-` prefix. The
required copies are `qa-report.md` and `qa-result.json`.

## Required next work

State the intended run length numerically in README, replace the unmeasured
word “short,” add the exact public claim to `.factory/claims.json`, and add its
one matching sandbox outcome test. Rerun the suite and the new claim command.

Backend isolation, restart persistence, health, 429 handling, multiplayer,
billing, and live model checks do not apply to this static single-player game.
