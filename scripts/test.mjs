import { spawnSync } from 'node:child_process';

const extra = process.argv.slice(2);
const hasOfflineFilter = extra.some((argument) => argument.includes('@claim:offline-reload'));

function runPlaywright(argumentsList) {
  const result = spawnSync('npx', ['playwright', 'test', ...argumentsList], { stdio: 'inherit', shell: process.platform === 'win32' });
  return result.status ?? 1;
}

if (hasOfflineFilter) {
  process.exit(runPlaywright(['--project=phone', ...extra]));
}

const offlineStatus = runPlaywright(['--project=phone', '--grep', '@claim:offline-reload']);
if (offlineStatus !== 0) process.exit(offlineStatus);
process.exit(runPlaywright(['--grep-invert', '@claim:offline-reload', ...extra]));
