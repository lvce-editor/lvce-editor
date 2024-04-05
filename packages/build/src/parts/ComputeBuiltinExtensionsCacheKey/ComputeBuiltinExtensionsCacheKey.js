import * as ComputeCacheKey from '../ComputeCacheKey/ComputeCacheKey.js'

const locations = [
  'packages/build/src/parts/ComputeBuiltinExtensionsCacheKey/ComputeBuiltinExtensionsCacheKey.js',
  'packages/build/src/parts/DownloadBuiltinExtensions/DownloadBuiltinExtensions.js',
  'packages/build/src/parts/DownloadBuiltinExtensions/builtinExtensions.json',
  'packages/build/src/parts/ComputeCacheKey/ComputeCacheKey.js',
]

const main = async () => {
  const hash = await ComputeCacheKey.computeCacheKey(locations)
  process.stdout.write(hash)
}

main()
