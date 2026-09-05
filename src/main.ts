import './style.css';
import { habitats, choicesFor, cleanPracticeSeed, compareGuess, dailySeed, targetFor, type Habitat } from './game';

type Mode = 'daily' | 'practice';
type RunStatus = 'playing' | 'won' | 'lost';
type Run = {
  mode: Mode;
  seed: string;
  guesses: string[];
  hints: number;
  status: RunStatus;
  startedAt: number;
};
type Settings = { theme: 'dark' | 'light'; assist: boolean; motion: boolean; sound: boolean };

const app = document.querySelector<HTMLDivElement>('#app')!;
if (!app) throw new Error('The game could not start. Reload this page.');

const isDemo = new URLSearchParams(window.location.search).get('demo') === '1' || window.location.pathname === '/demo';
const storagePrefix = isDemo ? 'demo:signal-garden:' : 'signal-garden:';
const defaultSettings: Settings = { theme: 'dark', assist: false, motion: true, sound: false };
let settings = load<Settings>('settings', defaultSettings);
let run = load<Run>('run', makeRun('daily', dailySeed()));
let settingsOpen = false;
let practiceSeedText = '';
let renderRequested = false;
let simulationFrame = 0;
let lastTick = performance.now();
let simulatedTime = 0;

function storageKey(key: string): string { return `${storagePrefix}${key}`; }
function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(storageKey(key));
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}
function save(key: string, value: unknown): void {
  try { localStorage.setItem(storageKey(key), JSON.stringify(value)); } catch { /* private browsing can refuse storage */ }
}
function makeRun(mode: Mode, seed: string): Run {
  return { mode, seed, guesses: [], hints: 0, status: 'playing', startedAt: Date.now() };
}
function currentTarget(): Habitat { return targetFor(run.seed); }
function maxGuesses(): number { return run.mode === 'practice' || settings.assist ? 5 : 3; }
function route(): 'home' | 'demo' | 'privacy' | 'terms' | 'not-found' {
  if (window.location.pathname === '/demo') return 'demo';
  if (window.location.pathname === '/privacy') return 'privacy';
  if (window.location.pathname === '/terms') return 'terms';
  if (window.location.pathname === '/404' || window.location.pathname === '/404.html') return 'not-found';
  return 'home';
}
function titleFor(currentRoute: ReturnType<typeof route>): string {
  if (currentRoute === 'demo') return 'Demo — Practice After Daily';
  if (currentRoute === 'privacy') return 'Privacy — Practice After Daily';
  if (currentRoute === 'terms') return 'Terms — Practice After Daily';
  if (currentRoute === 'not-found') return 'Page not found — Practice After Daily';
  return 'Practice After Daily — Practise a habitat puzzle';
}
function metadataFor(currentRoute: ReturnType<typeof route>): { path: string; description: string } {
  if (currentRoute === 'demo') return { path: '/demo', description: 'Try a labelled sample Signal Garden practice run with hints.' };
  if (currentRoute === 'privacy') return { path: '/privacy', description: 'Read how Practice After Daily keeps game progress in your browser.' };
  if (currentRoute === 'terms') return { path: '/terms', description: 'Read the terms for the fictional Practice After Daily game.' };
  if (currentRoute === 'not-found') return { path: '/404', description: 'This Practice After Daily page does not exist.' };
  return { path: '/', description: 'Play a daily fictional habitat puzzle, then practise with hints at your own pace.' };
}
function updateMetadata(currentRoute: ReturnType<typeof route>): void {
  const metadata = metadataFor(currentRoute);
  const title = titleFor(currentRoute);
  const canonical = `https://practice-after-daily.sociobot.in${metadata.path}`;
  document.querySelector<HTMLLinkElement>('#canonical')?.setAttribute('href', canonical);
  document.querySelector<HTMLMetaElement>('#page-description')?.setAttribute('content', metadata.description);
  document.querySelector<HTMLMetaElement>('#og-title')?.setAttribute('content', title);
  document.querySelector<HTMLMetaElement>('#og-description')?.setAttribute('content', metadata.description);
  document.querySelector<HTMLMetaElement>('#twitter-title')?.setAttribute('content', title);
  document.querySelector<HTMLMetaElement>('#twitter-description')?.setAttribute('content', metadata.description);
}
function requestRender(): void {
  if (!renderRequested) {
    renderRequested = true;
    requestAnimationFrame(() => { renderRequested = false; render(); });
  }
}
function persistRun(): void { save('run', run); }
function recordFinish(): void {
  const stats = load<{ completed: number; won: number; practiceStarted: number }>('stats', { completed: 0, won: 0, practiceStarted: 0 });
  stats.completed += 1;
  if (run.status === 'won') stats.won += 1;
  save('stats', stats);
}
function relativePath(path: string): string { return isDemo && path === '/' ? '/demo' : path; }
function navigate(path: string): void {
  window.history.pushState({}, '', path);
  render();
  window.scrollTo({ top: 0, behavior: settings.motion && !reducedMotion() ? 'smooth' : 'auto' });
  window.setTimeout(() => document.querySelector<HTMLElement>('h1')?.focus(), 0);
}
function reducedMotion(): boolean { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
function pageShell(content: string, currentRoute: ReturnType<typeof route>): string {
  const demoBanner = isDemo ? `
    <aside class="demo-banner" aria-label="Demo mode">
      <span><strong>Demo — sample data, nothing is saved.</strong> This run uses separate browser storage.</span>
      <span class="demo-actions"><button class="text-button" data-action="reset-demo">Reset demo</button><a data-action="start-real" href="/">Start for real</a></span>
    </aside>` : '';
  return `
    <header class="site-header">
      <a class="wordmark" href="${relativePath('/')}" aria-label="Practice After Daily home"><span aria-hidden="true" class="wordmark-mark">✦</span> Practice After Daily</a>
      <nav aria-label="Main navigation">
        <a ${currentRoute === 'home' ? 'aria-current="page"' : ''} href="${relativePath('/')}">Play</a>
        <a ${currentRoute === 'demo' ? 'aria-current="page"' : ''} href="/demo">Demo</a>
        <a ${currentRoute === 'privacy' ? 'aria-current="page"' : ''} href="/privacy">Privacy</a>
        <button class="nav-settings" data-action="open-settings" aria-haspopup="dialog">Settings</button>
      </nav>
    </header>
    ${demoBanner}
    <main id="main" tabindex="-1">${content}</main>
    <footer class="site-footer">
      <p>Play one fictional habitat puzzle each day, then practise with hints.</p>
      <p><a href="/privacy">Privacy</a> <a href="/terms">Terms</a> <span>Built by Param Factory</span> <span>v1.0.0</span></p>
      <p class="generated-note">The garden marks are hand-drawn SVG and CSS shapes, not real biology.</p>
    </footer>
    <p class="sr-only" id="route-announcement" aria-live="polite"></p>
    ${settingsOpen ? settingsDialog() : ''}`;
}
function traitRows(target: Habitat): string {
  const shown: Array<[string, string]> = [
    ['Canopy shape', target.traits.canopy],
    ['Water pattern', target.traits.water],
  ];
  if (run.hints >= 1 || settings.assist) shown.push(['Signal', target.traits.signal]);
  if (run.hints >= 2 || settings.assist) shown.push(['Ground', target.traits.ground]);
  return shown.map(([label, value]) => `<div class="trait"><dt>${label}</dt><dd>${value}</dd></div>`).join('');
}
function gameArt(target: Habitat): string {
  const stemCount = 7 + (target.name.length % 5);
  const stems = Array.from({ length: stemCount }, (_, index) => {
    const left = 10 + index * (78 / (stemCount - 1));
    const height = 30 + ((index * 19 + target.id.length * 7) % 45);
    const width = index % 2 ? 12 : 18;
    return `<i style="--left:${left}%;--height:${height}%;--width:${width}px;--delay:${index * 80}ms"></i>`;
  }).join('');
  return `<div class="garden-art" style="--garden-color:${target.color}" role="img" aria-label="Abstract garden mark for the current fictional habitat. It does not identify the answer."><span class="moon"></span><span class="horizon"></span><span class="stems">${stems}</span></div>`;
}
function feedbackBlock(target: Habitat): string {
  if (run.guesses.length === 0) return '<p class="feedback empty-feedback">Choose a habitat type. Each wrong answer compares its traits with the record.</p>';
  const guess = habitats.find((habitat) => habitat.id === run.guesses.at(-1));
  if (!guess) return '';
  const compared = compareGuess(target, guess);
  return `<div class="feedback" aria-live="polite"><p><strong>${guess.name}</strong> has ${compared.matchCount} matching ${compared.matchCount === 1 ? 'trait' : 'traits'}.</p><ul>${compared.lines.map((line) => `<li>${line}</li>`).join('')}</ul></div>`;
}
function puzzlePanel(): string {
  const target = currentTarget();
  const choices = choicesFor(run.seed);
  const canHint = run.status === 'playing' && run.hints < 2;
  const end = run.status !== 'playing';
  const endHeading = run.status === 'won' ? 'You classified the habitat' : 'No guesses left';
  const endText = run.status === 'won'
    ? `${target.explanation} You used ${run.guesses.length} of ${maxGuesses()} guesses.`
    : `The answer was ${target.name}. ${target.explanation}`;
  return `
    <section class="puzzle-shell" aria-labelledby="puzzle-title">
      <div class="puzzle-heading">
        <div>
          <p class="eyebrow">${run.mode === 'daily' ? 'Today’s daily puzzle' : 'Practice run'}</p>
          <h2 id="puzzle-title">${end ? endHeading : 'Classify this fictional habitat'}</h2>
          <p class="puzzle-goal">${end ? endText : `Choose the habitat type in ${maxGuesses()} guesses. Seed: ${run.seed}.`}</p>
        </div>
        <div class="run-count" aria-label="Guesses remaining"><strong>${end ? 'Complete' : maxGuesses() - run.guesses.length}</strong><span>${end ? 'run' : 'left'}</span></div>
      </div>
      <div class="puzzle-grid">
        <div class="observation">
          ${gameArt(target)}
          <div class="observation-copy">
            <h3>Field notes</h3>
            <dl class="traits">${traitRows(target)}</dl>
            ${canHint ? `<button class="secondary-button hint-button" data-action="hint">Show a hint (${2 - run.hints} left)</button>` : ''}
            ${run.hints > 0 ? `<p class="hint" aria-live="polite"><strong>Hint:</strong> ${target.clue}</p>` : ''}
          </div>
        </div>
        <div class="answer-area">
          ${end ? `
            <div class="end-screen" aria-live="polite">
              <p class="result-mark" aria-hidden="true">${run.status === 'won' ? '✦' : '○'}</p>
              <p>${run.status === 'won' ? 'Correct answer' : 'Explanation'}</p>
              <h3>${target.name}</h3>
              <div class="end-actions">
                <button class="primary-button" data-action="restart">Restart this run</button>
                <button class="secondary-button" data-action="practice" data-seed="${run.seed}-next">Practise another seed</button>
              </div>
            </div>` : `
            <h3>Choose a habitat type</h3>
            <div class="choice-grid" role="group" aria-label="Habitat types">
              ${choices.map((choice) => `<button class="choice-button ${run.guesses.includes(choice.id) ? 'used' : ''}" data-action="guess" data-id="${choice.id}" ${run.guesses.includes(choice.id) ? 'disabled' : ''}><span>${choice.name}</span><small>${choice.region}</small></button>`).join('')}
            </div>
            ${feedbackBlock(target)}
            <p class="keyboard-note">Use Tab and Enter to choose an answer. Hints do not cost a guess.</p>`}
        </div>
      </div>
    </section>`;
}
function practicePanel(): string {
  return `
    <section class="practice-panel" aria-labelledby="practice-title">
      <div>
        <p class="eyebrow">Practice stays open</p>
        <h2 id="practice-title">Practise a new habitat with hints</h2>
        <p>Choose a seed or use the next suggested run. Practice gives five guesses and two optional hints.</p>
      </div>
      <form class="practice-form" data-form="practice">
        <label for="practice-seed">Practice seed</label>
        <div><input id="practice-seed" name="practice-seed" value="${practiceSeedText}" minlength="3" maxlength="24" autocomplete="off" aria-describedby="practice-help" /><button class="primary-button" type="submit">Start practice</button></div>
        <p id="practice-help">Use letters, numbers, or dashes. Example: copper-rain.</p>
      </form>
      <button class="text-button next-seed" data-action="practice" data-seed="${run.seed}-next">Use suggested seed: ${run.seed}-next</button>
    </section>`;
}
function homePage(): string {
  return `
    <section class="intro" aria-labelledby="page-title">
      <div class="intro-copy">
        <p class="eyebrow">A daily classification game</p>
        <h1 id="page-title" tabindex="-1">Classify today’s fictional habitat</h1>
        <p class="lead">For daily-puzzle players who want a calm way to learn after a shared challenge.</p>
        <div class="start-actions">
          <a class="primary-button" href="/demo">Try it with sample data</a>
          <span>Opens a separate sample run.</span>
          <button class="secondary-button" data-action="daily">Play today’s daily</button>
        </div>
        <ul class="facts" aria-label="Game facts"><li>Free to play</li><li>No account or payment</li><li>Progress stays in this browser</li></ul>
      </div>
      <aside class="daily-status" aria-label="Current game status"><span class="status-dot" aria-hidden="true"></span><span>${run.mode === 'daily' ? 'Daily run ready' : 'Practice run active'}</span><strong>${run.status === 'playing' ? `${maxGuesses() - run.guesses.length} guesses left` : 'Run complete'}</strong></aside>
    </section>
    ${puzzlePanel()}
    ${practicePanel()}
    <section class="how-it-works" aria-labelledby="how-title">
      <h2 id="how-title">How the game works</h2>
      <ol>
        <li><strong>Read the traits.</strong> Compare the canopy, water, signal, and ground notes.</li>
        <li><strong>Choose a habitat.</strong> A wrong choice shows which traits match.</li>
        <li><strong>Practise openly.</strong> Start any seed with optional hints and more guesses.</li>
      </ol>
    </section>
    <section class="limits" aria-labelledby="limits-title">
      <h2 id="limits-title">What this game does not do</h2>
      <p>These habitats and traits are invented for play. The game gives no biology, health, or scientific advice.</p>
      <p>Your choices and settings are saved only in local browser storage. The game has no analytics or remote account.</p>
    </section>`;
}
function legalPage(kind: 'privacy' | 'terms'): string {
  const privacy = kind === 'privacy';
  return `
    <article class="legal-page" aria-labelledby="page-title">
      <p class="eyebrow">Practice After Daily</p>
      <h1 id="page-title" tabindex="-1">${privacy ? 'Privacy' : 'Terms of use'}</h1>
      ${privacy ? `
        <p>Practice After Daily stores game progress and settings in your browser. It does not use an account, analytics, advertising, or a remote database.</p>
        <h2>What stays on your device</h2>
        <p>Your current run, completed-run count, and settings are held in local browser storage. Clearing site data removes them.</p>
        <h2>Demo mode</h2>
        <p>The demo uses a separate local storage name. Reset demo removes only its sample run and settings.</p>
        <h2>Network requests</h2>
        <p>The app loads its own files and can cache them for offline use. It does not send your choices to a server.</p>` : `
        <p>Practice After Daily is a free fictional classification game. You may play it for personal use.</p>
        <h2>Fictional content</h2>
        <p>Every habitat, trait, and explanation is invented. Do not use this game for biology, health, safety, or scientific decisions.</p>
        <h2>Availability</h2>
        <p>The game is provided as is. Local game progress can be removed when browser data is cleared.</p>
        <h2>Contact</h2>
        <p>For product feedback, contact the Param Factory through its public site.</p>`}
    </article>`;
}
function notFoundPage(): string {
  return `<section class="not-found" aria-labelledby="page-title"><p class="eyebrow">404</p><h1 id="page-title" tabindex="-1">Page not found</h1><p>This address does not lead to a game page.</p><a class="primary-button" href="${relativePath('/')}">Play the daily puzzle</a></section>`;
}
function settingsDialog(): string {
  return `
    <div class="dialog-backdrop" data-action="close-settings"></div>
    <section class="settings-dialog" role="dialog" aria-modal="true" aria-labelledby="settings-title" aria-describedby="settings-copy">
      <div class="dialog-heading"><div><p class="eyebrow">Game settings</p><h2 id="settings-title">Choose your play settings</h2></div><button class="icon-button" data-action="close-settings" aria-label="Close settings">×</button></div>
      <p id="settings-copy">Settings stay in this browser.</p>
      <fieldset><legend>Appearance</legend><label class="switch-row"><span>Light background</span><input type="checkbox" data-setting="theme" ${settings.theme === 'light' ? 'checked' : ''} /><span class="switch" aria-hidden="true"></span></label></fieldset>
      <fieldset><legend>Play help</legend><label class="switch-row"><span>Assist mode: show all traits and give five guesses</span><input type="checkbox" data-setting="assist" ${settings.assist ? 'checked' : ''} /><span class="switch" aria-hidden="true"></span></label></fieldset>
      <fieldset><legend>Motion and sound</legend><label class="switch-row"><span>Gentle garden movement</span><input type="checkbox" data-setting="motion" ${settings.motion ? 'checked' : ''} /><span class="switch" aria-hidden="true"></span></label><label class="switch-row"><span>Soft result sound</span><input type="checkbox" data-setting="sound" ${settings.sound ? 'checked' : ''} /><span class="switch" aria-hidden="true"></span></label></fieldset>
      <button class="primary-button" data-action="close-settings">Save settings</button>
    </section>`;
}
function render(): void {
  const currentRoute = route();
  document.title = titleFor(currentRoute);
  updateMetadata(currentRoute);
  document.documentElement.dataset.theme = settings.theme;
  document.documentElement.dataset.motion = settings.motion ? 'on' : 'off';
  const content = currentRoute === 'home' || currentRoute === 'demo' ? homePage() : currentRoute === 'privacy' ? legalPage('privacy') : currentRoute === 'terms' ? legalPage('terms') : notFoundPage();
  app.innerHTML = pageShell(content, currentRoute);
  const announcement = document.querySelector('#route-announcement');
  if (announcement) announcement.textContent = currentRoute === 'home' || currentRoute === 'demo' ? 'Game page loaded' : document.title;
  if (settingsOpen) window.setTimeout(() => document.querySelector<HTMLElement>('.settings-dialog button')?.focus(), 0);
}
function showHint(): void {
  run.hints += 1;
  persistRun();
  requestRender();
}
function useSound(): void {
  if (!settings.sound) return;
  try {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = run.status === 'won' ? 660 : 180;
    gain.gain.setValueAtTime(0.04, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.12);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(); oscillator.stop(context.currentTime + 0.13);
  } catch { /* Sound is optional. */ }
}
function guess(id: string): void {
  if (run.status !== 'playing' || run.guesses.includes(id)) return;
  run.guesses.push(id);
  if (id === currentTarget().id) run.status = 'won';
  else if (run.guesses.length >= maxGuesses()) run.status = 'lost';
  if (run.status !== 'playing') { recordFinish(); useSound(); }
  persistRun();
  requestRender();
}
function startRun(mode: Mode, seed: string): void {
  run = makeRun(mode, seed);
  if (mode === 'practice') {
    const stats = load<{ completed: number; won: number; practiceStarted: number }>('stats', { completed: 0, won: 0, practiceStarted: 0 });
    stats.practiceStarted += 1;
    save('stats', stats);
  }
  persistRun();
  requestRender();
  window.setTimeout(() => document.querySelector<HTMLElement>('#puzzle-title')?.focus(), 0);
}
function resetDemo(): void {
  clearDemoStorage();
  run = makeRun('practice', 'sample-garden');
  settings = { ...defaultSettings };
  practiceSeedText = 'sample-garden';
  persistRun(); save('settings', settings); requestRender();
}
function clearDemoStorage(): void {
  Object.keys(localStorage).filter((key) => key.startsWith('demo:signal-garden:')).forEach((key) => localStorage.removeItem(key));
}
function closeSettings(): void {
  settingsOpen = false;
  requestRender();
  window.setTimeout(() => document.querySelector<HTMLButtonElement>('[data-action="open-settings"]')?.focus(), 0);
}
function attachEvents(): void {
  document.addEventListener('click', (event) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'guess' && target.dataset.id) guess(target.dataset.id);
    if (action === 'hint') showHint();
    if (action === 'restart') startRun(run.mode, run.seed);
    if (action === 'daily') startRun('daily', dailySeed());
    if (action === 'practice' && target.dataset.seed) startRun('practice', target.dataset.seed);
    if (action === 'open-settings') { settingsOpen = true; requestRender(); }
    if (action === 'close-settings') closeSettings();
    if (action === 'reset-demo') resetDemo();
    if (action === 'start-real') clearDemoStorage();
  });
  document.addEventListener('change', (event) => {
    const input = event.target as HTMLInputElement;
    const setting = input.dataset.setting;
    if (!setting) return;
    if (setting === 'theme') settings.theme = input.checked ? 'light' : 'dark';
    if (setting === 'assist') settings.assist = input.checked;
    if (setting === 'motion') settings.motion = input.checked;
    if (setting === 'sound') settings.sound = input.checked;
    document.documentElement.dataset.theme = settings.theme;
    document.documentElement.dataset.motion = settings.motion ? 'on' : 'off';
    save('settings', settings);
  });
  document.addEventListener('keydown', (event) => {
    if (!settingsOpen) return;
    if (event.key === 'Escape') {
      closeSettings();
      return;
    }
    if (event.key !== 'Tab') return;
    const dialog = document.querySelector<HTMLElement>('.settings-dialog');
    const focusable = dialog ? [...dialog.querySelectorAll<HTMLElement>('button, input, [href], [tabindex]:not([tabindex="-1"])')].filter((element) => !element.hasAttribute('disabled')) : [];
    if (!focusable.length) return;
    const current = document.activeElement as HTMLElement;
    const first = focusable[0];
    const last = focusable.at(-1)!;
    if (event.shiftKey && current === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && current === last) { event.preventDefault(); first.focus(); }
  });
  document.addEventListener('submit', (event) => {
    const form = event.target as HTMLFormElement;
    if (form.dataset.form !== 'practice') return;
    event.preventDefault();
    const input = form.elements.namedItem('practice-seed') as HTMLInputElement;
    const seed = cleanPracticeSeed(input.value);
    if (!seed) {
      input.setCustomValidity('Enter at least three letters, numbers, or dashes.');
      input.reportValidity();
      return;
    }
    input.setCustomValidity('');
    practiceSeedText = seed;
    startRun('practice', seed);
  });
  window.addEventListener('popstate', () => { render(); window.setTimeout(() => document.querySelector<HTMLElement>('h1')?.focus(), 0); });
  document.addEventListener('visibilitychange', () => { lastTick = performance.now(); });
}
function startSimulation(): void {
  const tick = (now: number) => {
    const delta = Math.min(100, now - lastTick);
    lastTick = now;
    if (!document.hidden) simulatedTime += delta;
    simulationFrame = requestAnimationFrame(tick);
  };
  simulationFrame = requestAnimationFrame(tick);
  window.addEventListener('beforeunload', () => cancelAnimationFrame(simulationFrame));
}
function registerOfflineShell(): void {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;
      const urls = [location.href, ...performance.getEntriesByType('resource').map((entry) => entry.name)].filter((url) => url.startsWith(location.origin));
      const worker = navigator.serviceWorker.controller ?? registration.active ?? registration.waiting;
      if (!worker) return;
      await new Promise<void>((resolve) => {
        const channel = new MessageChannel();
        const timeout = window.setTimeout(resolve, 2_500);
        channel.port1.onmessage = () => { window.clearTimeout(timeout); resolve(); };
        worker.postMessage({ type: 'CACHE_URLS', urls }, [channel.port2]);
      });
    } catch { /* The game still works online if a browser blocks service workers. */ }
  });
}
attachEvents();
if (isDemo && !localStorage.getItem(storageKey('run'))) {
  run = makeRun('practice', 'sample-garden');
  practiceSeedText = 'sample-garden';
  persistRun();
}
startSimulation();
registerOfflineShell();
render();

export { cleanPracticeSeed, choicesFor, compareGuess, dailySeed, targetFor };
