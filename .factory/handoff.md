# Handoff — independent verification 3

## Result

**PASS — 0 findings of every severity and 0 untested public claims.**

Implementation reviewed:
`4a66e31b058690da9f48511db9d9c546dba143d9`.

Documentation baseline reviewed:
`7cfec0401eeb8c6fe6e7f680e70228abdf0b00cf`.
The commits after the implementation change only this handoff file. The live
product bundle matches the clean implementation build byte for byte.

Live product: <https://practice-after-daily.sociobot.in>.

The full independent report is in
[`.factory/verification-3.md`](verification-3.md).

## What was verified

- Fresh desktop and Pixel 5 phone browsers showed the classification job,
  daily-puzzle audience, sample action, and active game before scrolling.
- The one-click sample stayed labelled, used separate storage, showed realistic
  feedback, recovered after reload, reset safely, and did not change real data.
- The recorded sample run reached the Dew Ladder win screen. A fresh daily run
  reached the Pollen Gate loss screen. Restart restored the initial state.
- Invalid-to-valid seed recovery, the 24-character boundary, settings,
  keyboard, pointer, touch, dialog focus, route focus, 200% text, reduced
  motion, offline reload, links, legal pages, and the designed 404 all passed.
- Axe found zero violations on six route states and the open light settings
  dialog. Lighthouse scored 100 in all four categories.
- All 12 exact claim commands passed independently. No unlisted or incomplete
  public claim was found.
- Every finding from verifications 1 and 2 remains resolved.

No product code was changed during this verification.

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

Run each command in `.factory/claims.json` independently. For live structure
checks:

```sh
./verify-url.sh https://practice-after-daily.sociobot.in/
./verify-url.sh https://practice-after-daily.sociobot.in/demo
./verify-url.sh https://practice-after-daily.sociobot.in/privacy
./verify-url.sh https://practice-after-daily.sociobot.in/terms
./verify-url.sh https://practice-after-daily.sociobot.in/404.html
./verify-url.sh https://practice-after-daily.sociobot.in/a-fresh-missing-route 404
```

The full suite passed its isolated phone offline check, followed by 45 passing
checks and three intentional desktop skips for phone-only measurements. The
build is 27.82 KB JavaScript and 18.82 KB CSS before gzip.

## Performance and evidence

The live visual loop measured 60.88 FPS on desktop and 61.04 FPS in the phone
browser context. Lighthouse measured FCP 0.90 s, LCP 0.94 s, TBT 20.5 ms, and
CLS 0.

Primary evidence is under `/work/.evidence/` with the `verify-3-` prefix. It
includes the recorded sample run, win and loss screens, phone and desktop
screens, live-browser results, claim logs, build and test logs, route checks,
and Lighthouse JSON. The required copies are `qa-report.md` and
`qa-result.json`.

## Known gaps

No verification defect remains. The FPS result uses verification browsers,
not a physical phone. The brief's aggregate retention measure cannot be
calculated without remote analytics, and the product does not claim that it
can.

Backend isolation, restart persistence, health, 429 handling, multiplayer,
billing, and live model checks do not apply to this static single-player game.
