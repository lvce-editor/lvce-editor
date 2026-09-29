import * as ComputeCacheKey from '../ComputeCacheKey/ComputeCacheKey.ts'

const locations = [
  'packages/build/src/parts/ComputeBuiltinExtensionsCacheKey/ComputeBuiltinExtensionsCacheKey.ts',
  'packages/build/src/parts/DownloadBuiltinExtensions/DownloadBuiltinExtensions.ts',
  'packages/build/src/parts/DownloadBuiltinExtensions/builtinExtensions.json',
  'packages/build/src/parts/ComputeCacheKey/ComputeCacheKey.ts',
]

const main = async () => {
  const hash = await ComputeCacheKey.computeCacheKey(locations)
  process.stdout.write(hash)
}

main()
