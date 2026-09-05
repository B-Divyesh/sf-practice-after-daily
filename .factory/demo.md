# Demo sandbox

Open `https://practice-after-daily.sociobot.in/demo` or use **Try it with sample
data** on the first screen. The demo starts a realistic practice run with the
`sample-garden` seed, five guesses, and optional hints.

The demo banner remains visible throughout the run: **Demo — sample data,
nothing is saved.** Its **Reset demo** action clears only keys beginning with
`demo:signal-garden:` and restores the sample run. **Start for real** leaves the
demo URL and uses the separate `signal-garden:` local-storage namespace. Demo
mode never reads or writes that real namespace.

The service worker also caches the sample shell after the first visit. The
offline claim is verified only with the `/demo` entry point.
