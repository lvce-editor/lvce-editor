import * as ComputeCacheKey from '../ComputeCacheKey/ComputeCacheKey.js'

const locations = [
  'lerna.json',
  'package-lock.json',
  'build/package-lock.json',
  'packages/extension-host/package-lock.json',
  'packages/pty-host/package-lock.json',
  'packages/main-process/package-lock.json',
  'packages/renderer-process/package-lock.json',
  'packages/renderer-worker/package-lock.json',
  'packages/shared-process/package-lock.json',
  'packages/server/package-lock.json',
  'build/src/parts/ComputeNodeModulesCacheKey/ComputeNodeModulesCacheKey.js',
  'build/src/parts/ComputeCacheKey/ComputeCacheKey.js',
  'build/src/parts/Hash/Hash.js',
  '.github/actions/ci.yml',
  '.github/actions/release.yml',
]

const main = async () => {
  const hash = await ComputeCacheKey.computeCacheKey(locations)
  process.stdout.write(hash)
}

main()
