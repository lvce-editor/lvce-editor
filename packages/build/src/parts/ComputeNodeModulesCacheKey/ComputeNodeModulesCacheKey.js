import * as ComputeCacheKey from '../ComputeCacheKey/ComputeCacheKey.js'

const locations = [
  '.nvmrc',
  'lerna.json',
  'package-lock.json',
  'packages/build/package-lock.json',
  'packages/diff-worker/package-lock.json',
  'packages/editor-worker/package-lock.json',
  'packages/embeds-process/package-lock.json',
  'packages/embeds-worker/package-lock.json',
  'packages/extension-host-helper-process/package-lock.json',
  'packages/extension-host-sub-worker/package-lock.json',
  'packages/extension-host-worker-tests/package-lock.json',
  'packages/extension-host-worker/package-lock.json',
  'packages/extension-host/package-lock.json',
  'packages/main-process/package-lock.json',
  'packages/network-process/package-lock.json',
  'packages/preload/package-lock.json',
  'packages/pty-host/package-lock.json',
  'packages/renderer-process/package-lock.json',
  'packages/renderer-worker/package-lock.json',
  'packages/search-process/package-lock.json',
  'packages/search-worker/package-lock.json',
  'packages/server/package-lock.json',
  'packages/shared-process/package-lock.json',
  'packages/typescript-compile-process/package-lock.json',
  'packages/syntax-highlighting-worker/package-lock.json',
  'packages/terminal-worker/package-lock.json',
  'packages/test-worker/package-lock.json',
  'packages/build/src/parts/ComputeNodeModulesCacheKey/ComputeNodeModulesCacheKey.js',
  'packages/build/src/parts/ComputeCacheKey/ComputeCacheKey.js',
  'packages/build/src/parts/Hash/Hash.js',
  '.github/workflows/ci.yml',
  '.github/workflows/pr.yml',
  '.github/workflows/release.yml',
]

const main = async () => {
  const hash = await ComputeCacheKey.computeCacheKey(locations)
  process.stdout.write(hash)
}

main()
