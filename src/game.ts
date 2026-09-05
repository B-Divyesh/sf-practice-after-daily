export type TraitKey = 'canopy' | 'water' | 'signal' | 'ground';
export type Habitat = {
  id: string;
  name: string;
  region: string;
  traits: Record<TraitKey, string>;
  clue: string;
  explanation: string;
  color: string;
};

export const habitats: Habitat[] = [
  { id: 'amber-shelf', name: 'Amber Shelf', region: 'a warm ridge after rain', traits: { canopy: 'copper fans', water: 'slow mist', signal: 'three low chimes', ground: 'waxen gravel' }, clue: 'The canopy catches late light like folded paper.', explanation: 'Copper fans catch the mist. Their low chimes mark a shelf habitat.', color: '#d98d45' },
  { id: 'brine-arch', name: 'Brine Arch', region: 'a salt-cut inlet', traits: { canopy: 'glass reeds', water: 'tidal beads', signal: 'one bright click', ground: 'blue salt' }, clue: 'Look for water that arrives in beads, not a stream.', explanation: 'Glass reeds grow from blue salt where the tide leaves beaded water.', color: '#86c4d4' },
  { id: 'cinder-hollow', name: 'Cinder Hollow', region: 'a sheltered warm hollow', traits: { canopy: 'charcoal fronds', water: 'warm drips', signal: 'soft crackle', ground: 'black pumice' }, clue: 'The ground stays warm after the sky turns dark.', explanation: 'Charcoal fronds and black pumice identify a hollow that holds heat.', color: '#d46e58' },
  { id: 'dew-ladder', name: 'Dew Ladder', region: 'a steep, cool ledge', traits: { canopy: 'silver ladders', water: 'hanging dew', signal: 'two clear taps', ground: 'pale slate' }, clue: 'The water does not travel; it hangs from each rung.', explanation: 'Silver ladder growth holds dew over pale slate.', color: '#b7d7d0' },
  { id: 'echo-pond', name: 'Echo Pond', region: 'a quiet basin', traits: { canopy: 'round pads', water: 'still mirror', signal: 'four bell notes', ground: 'soft silt' }, clue: 'Count the notes reflected by the water.', explanation: 'Round pads and four bell notes settle around a still mirror pond.', color: '#6ea8b1' },
  { id: 'fern-sill', name: 'Fern Sill', region: 'a shaded stone sill', traits: { canopy: 'paper ferns', water: 'sideways spray', signal: 'one dry rattle', ground: 'green stone' }, clue: 'The water comes from the side, not above.', explanation: 'Paper ferns cling to green stone where spray meets the sill.', color: '#8bb75b' },
  { id: 'gilded-run', name: 'Gilded Run', region: 'a bright, fast channel', traits: { canopy: 'gold threads', water: 'quick current', signal: 'five tiny rings', ground: 'white pebbles' }, clue: 'The current makes the signal arrive in a small cluster.', explanation: 'Gold threads trail through a quick channel over white pebbles.', color: '#e2bc55' },
  { id: 'hush-marsh', name: 'Hush Marsh', region: 'a low foggy flat', traits: { canopy: 'velvet cups', water: 'hidden seep', signal: 'no audible call', ground: 'deep peat' }, clue: 'This habitat is identified by what you do not hear.', explanation: 'Velvet cups grow above a hidden seep in quiet deep peat.', color: '#678a70' },
  { id: 'iris-cove', name: 'Iris Cove', region: 'a narrow bright cove', traits: { canopy: 'violet sails', water: 'clear pool', signal: 'two rising tones', ground: 'smooth shell' }, clue: 'The call rises twice above the clear water.', explanation: 'Violet sails lean over a clear pool and smooth shell ground.', color: '#a182c5' },
  { id: 'juniper-step', name: 'Juniper Step', region: 'a dry high step', traits: { canopy: 'needle flags', water: 'night frost', signal: 'one long hum', ground: 'red dust' }, clue: 'Water appears only after dark.', explanation: 'Needle flags collect night frost above red dust.', color: '#bc7254' },
  { id: 'kite-meadow', name: 'Kite Meadow', region: 'an open windy field', traits: { canopy: 'diamond leaves', water: 'windborne rain', signal: 'three flutter beats', ground: 'spring turf' }, clue: 'The water arrives at an angle with the wind.', explanation: 'Diamond leaves beat in windborne rain over spring turf.', color: '#a8c760' },
  { id: 'lumen-ditch', name: 'Lumen Ditch', region: 'a narrow shaded channel', traits: { canopy: 'lantern moss', water: 'cold trickle', signal: 'one green pulse', ground: 'dark clay' }, clue: 'The only light comes close to the ground.', explanation: 'Lantern moss sends a green pulse beside a cold trickle.', color: '#77bd91' },
  { id: 'morrow-spur', name: 'Morrow Spur', region: 'an east-facing spur', traits: { canopy: 'rose hooks', water: 'morning film', signal: 'six faint ticks', ground: 'pink shale' }, clue: 'The water vanishes before midday.', explanation: 'Rose hooks catch a morning film on pink shale.', color: '#d78b9d' },
  { id: 'nacre-fold', name: 'Nacre Fold', region: 'a folded coastal wall', traits: { canopy: 'pearl ribbons', water: 'salt fog', signal: 'three hollow knocks', ground: 'striped rock' }, clue: 'The signal sounds hollow against the wall.', explanation: 'Pearl ribbons hold salt fog in folds of striped rock.', color: '#c8b8d4' },
  { id: 'opal-plain', name: 'Opal Plain', region: 'a wide low plain', traits: { canopy: 'opal scales', water: 'rain pools', signal: 'two soft pulses', ground: 'grey loam' }, clue: 'Small pools remain after a short rain.', explanation: 'Opal scales gather around rain pools in grey loam.', color: '#9bb5c9' },
  { id: 'pollen-gate', name: 'Pollen Gate', region: 'a sunny pass', traits: { canopy: 'yellow cones', water: 'thin rill', signal: 'four buzzing notes', ground: 'ochre sand' }, clue: 'The signal has a buzz instead of a bell.', explanation: 'Yellow cones line a thin rill through ochre sand.', color: '#d7ad42' },
  { id: 'quartz-nest', name: 'Quartz Nest', region: 'a bright sheltered pocket', traits: { canopy: 'clear cups', water: 'crystal drip', signal: 'one sharp ring', ground: 'quartz chips' }, clue: 'Each drop makes one sharp ring.', explanation: 'Clear cups catch crystal drips above quartz chips.', color: '#a9d7d6' },
  { id: 'ripple-bank', name: 'Ripple Bank', region: 'a low river bend', traits: { canopy: 'wave grasses', water: 'broad ripples', signal: 'five low pops', ground: 'river sand' }, clue: 'The water moves wide, not fast.', explanation: 'Wave grasses follow broad ripples over river sand.', color: '#80afb5' },
  { id: 'saffron-gap', name: 'Saffron Gap', region: 'a dry split in rock', traits: { canopy: 'saffron fans', water: 'rare drops', signal: 'two dry snaps', ground: 'split basalt' }, clue: 'The ground is split but the fans stay open.', explanation: 'Saffron fans collect rare drops in split basalt.', color: '#e09b46' },
  { id: 'thistle-bowl', name: 'Thistle Bowl', region: 'a round wind-sheltered bowl', traits: { canopy: 'spined stars', water: 'spiral runoff', signal: 'three quick whistles', ground: 'brown clay' }, clue: 'Water circles inward before it disappears.', explanation: 'Spined stars trace spiral runoff over brown clay.', color: '#ab7f5a' },
  { id: 'umber-veil', name: 'Umber Veil', region: 'a dim woodland edge', traits: { canopy: 'brown veils', water: 'leaf drip', signal: 'one muted thud', ground: 'leaf mould' }, clue: 'The sound is softened by the canopy.', explanation: 'Brown veils soften leaf drip at a woodland edge.', color: '#90755f' },
  { id: 'vermilion-ford', name: 'Vermilion Ford', region: 'a shallow crossing', traits: { canopy: 'red arches', water: 'ankle flow', signal: 'four bright clacks', ground: 'flat stone' }, clue: 'You could cross this water without swimming.', explanation: 'Red arches span ankle-deep flow across flat stone.', color: '#d8644c' },
  { id: 'willow-slot', name: 'Willow Slot', region: 'a narrow green slot', traits: { canopy: 'willow loops', water: 'wall seep', signal: 'two low croons', ground: 'moss brick' }, clue: 'The water appears directly from the wall.', explanation: 'Willow loops mark a wall seep over moss brick.', color: '#789e6c' },
  { id: 'zephyr-terrace', name: 'Zephyr Terrace', region: 'a high open terrace', traits: { canopy: 'blue streamers', water: 'wind mist', signal: 'six airy notes', ground: 'chalk dust' }, clue: 'You hear the wind between every note.', explanation: 'Blue streamers hold wind mist over chalk dust.', color: '#739cc3' },
];

export function seededIndex(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % habitats.length;
}

export function seededNumber(seed: string): number {
  let value = seededIndex(seed) + 1;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
}

export function targetFor(seed: string): Habitat {
  return habitats[seededIndex(seed)];
}

export function choicesFor(seed: string): Habitat[] {
  const target = targetFor(seed);
  const remaining = habitats.filter((habitat) => habitat.id !== target.id);
  const picked: Habitat[] = [target];
  let state = Math.floor(seededNumber(`${seed}:options`) * 2147483647) || 1;
  while (picked.length < 5) {
    state = (state * 48271) % 2147483647;
    const candidate = remaining[state % remaining.length];
    if (!picked.some((habitat) => habitat.id === candidate.id)) picked.push(candidate);
  }
  return picked.sort((a, b) => a.name.localeCompare(b.name));
}

export function compareGuess(target: Habitat, guess: Habitat): { matchCount: number; lines: string[] } {
  const labels: Record<TraitKey, string> = {
    canopy: 'Canopy', water: 'Water', signal: 'Signal', ground: 'Ground',
  };
  const keys = Object.keys(target.traits) as TraitKey[];
  const lines = keys.map((key) => `${labels[key]}: ${guess.traits[key] === target.traits[key] ? 'match' : 'different'}`);
  return { matchCount: keys.filter((key) => guess.traits[key] === target.traits[key]).length, lines };
}

export function dailySeed(date = new Date()): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

export function cleanPracticeSeed(value: string): string | null {
  const cleaned = value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 24);
  return cleaned.length >= 3 ? cleaned : null;
}
