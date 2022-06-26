import * as ComputeCacheKey from '../ComputeCacheKey/ComputeCacheKey.js'

const locations = [
  'build/src/parts/ComputeBuiltinExtensionsCacheKey/ComputeBuiltinExtensionsCacheKey.js',
  'build/src/parts/DownloadBuiltinExtensions/DownloadBuiltinExtensions.js',
  'build/src/parts/DownloadBuiltinExtensions/builtinExtensions.json',
  'build/src/parts/ComputeCacheKey/ComputeCacheKey.js',
]

const main = async () => {
  const hash = await ComputeCacheKey.computeCacheKey(locations)
  process.stdout.write(hash)
}

main()
