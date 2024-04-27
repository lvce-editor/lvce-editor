import * as CachePaths from '../CachePaths/CachePaths.js'
import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Remove from '../Remove/Remove.js'

export const bundlePreload = async ({ commitHash, product, version }) => {
  const cachePath = await CachePaths.getPreloadCachePath([product, version, commitHash])
  await Remove.remove(Path.absolute('packages/build/.tmp/cachedSources/preload'))
  await Copy.copy({
    from: 'packages/preload/src/index.js',
    to: Path.join(cachePath, 'src', 'index.js'),
  })
  await Copy.copy({
    from: 'packages/preload/package.json',
    to: Path.join(cachePath, 'package.json'),
  })
  return cachePath
}
