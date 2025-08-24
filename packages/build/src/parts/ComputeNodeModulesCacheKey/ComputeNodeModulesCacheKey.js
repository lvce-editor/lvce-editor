import * as ComputeCacheKey from '../ComputeCacheKey/ComputeCacheKey.js'

const locations = [
  '.nvmrc',
  'lerna.json',
  'package-lock.json',
  'packages/build/package-lock.json',
  'packages/extension-host-helper-process/package-lock.json',
  'packages/extension-host-worker-tests/package-lock.json',
  'packages/extension-host/package-lock.json',
  'packages/main-process/package-lock.json',
  'packages/renderer-worker/package-lock.json',
  'packages/server/package-lock.json',
  'packages/static-server/package-lock.json',
  'packages/shared-process/package-lock.json',
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

////
