# Practice After Daily

Practice After Daily is a free browser game for daily-puzzle players. Classify a
fictional habitat in a daily round designed to finish in two minutes or less,
then practise with optional hints.
It supports keyboard, pointer, and touch input for one player.

## Play

Open the live game at <https://practice-after-daily.sociobot.in>. The first
screen shows the daily puzzle. Choose a habitat type from the field notes.

Open <https://practice-after-daily.sociobot.in/demo> to start the labelled
sample run. Demo data uses a separate browser-storage namespace. Use **Reset
demo** to clear only sample progress.

The game is fictional. It does not give biology, health, or scientific advice.
Game progress and settings stay in browser storage. During a game, the app
requests only its static files from this product origin. No account or payment
is required. It works offline after the first service-worker-controlled visit.

## Run locally

Requires Node.js 22 or later and npm.

```sh
npm install
npm run dev
```

Open the URL printed by Vite. Use `npm run build` to make the static `dist/`
directory. The build copies the durable Static Web Apps configuration into
`dist/`.

## Verify

```sh
npm test
npm run build
npm run preview
./verify-url.sh http://127.0.0.1:4173/
```

The Playwright suite runs the outcome-based claims in
[.factory/claims.json](.factory/claims.json), including the isolated demo,
offline reload, end screen, restart, settings persistence, privacy requests,
and the visual-loop measurement. It also runs axe checks for serious and
critical accessibility issues.

## Deploy

This is a static Vite product. Push the reviewed `main` branch to its product
repository. The factory deployment serves `dist/` and its included
`staticwebapp.config.json`. No backend, database, credentials, or payment
provider is used.

## Product notes

The product has hand-written fictional habitat records. Date and practice seeds
choose records deterministically. Daily mode starts with three guesses.
Practice mode gives five guesses and two hints. The visual assets are original
CSS and SVG marks; see [.factory/design.md](.factory/design.md) for the full
visual system and provenance.

MIT licensed. See [LICENSE](LICENSE), [Privacy](/privacy), and [Terms](/terms).
