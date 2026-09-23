import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const repoRoot = process.cwd();
const debounceMs = 3000;
let syncTimer = null;
let syncing = false;

const ignoredPaths = [
  '.git',
  'node_modules',
  'dist',
  '.env',
  '.env.local',
  '.env.development.local',
  '.env.test.local',
  '.env.production.local'
];

function isIgnored(fileName = '') {
  const normalized = fileName.replaceAll('\\', '/');
  return ignoredPaths.some((ignoredPath) =>
    normalized === ignoredPath || normalized.startsWith(`${ignoredPath}/`)
  );
}

function git(args, options = {}) {
  return execFileSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: options.inherit ? 'inherit' : ['ignore', 'pipe', 'pipe']
  }).trim();
}

function syncChanges() {
  if (syncing) {
    return;
  }

  syncing = true;

  try {
    git(['add', '-A']);
    const pendingChanges = git(['status', '--porcelain']);

    if (!pendingChanges) {
      return;
    }

    const branch = git(['branch', '--show-current']);
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    git(['commit', '-m', `chore(auto): sync updates ${timestamp}`], { inherit: true });
    git(['push', 'origin', branch], { inherit: true });
    console.log(`[auto-push] Pushed updates to origin/${branch}.`);
  } catch (error) {
    console.error('[auto-push] Sync failed. Changes remain local.');
    console.error(error.stderr?.toString() || error.message);
  } finally {
    syncing = false;
  }
}

function scheduleSync() {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(syncChanges, debounceMs);
}

console.log('[auto-push] Watching for changes. Press Ctrl+C to stop.');
syncChanges();

fs.watch(repoRoot, { recursive: true }, (_eventType, fileName) => {
  if (!fileName || isIgnored(fileName.toString())) {
    return;
  }

  scheduleSync();
});
