import { existsSync } from 'fs'
import * as Copy from '../Copy/Copy.js'
import * as Hash from '../Hash/Hash.js'
import * as Path from '../Path/Path.js'
import * as ReadFile from '../ReadFile/ReadFile.js'

export const bundleMainProcessDependencies = async ({ cache = false }) => {
  const packageLockJson = await ReadFile.readFile(
    'packages/main-process/package-lock.json'
  )
  const hash = Hash.computeHash(packageLockJson)
  if (
    cache &&
    existsSync(
      Path.absolute(`build/.tmp/cachedDependencies/main-process/${hash}`)
    )
  ) {
    return Path.absolute(`build/.tmp/cachedDependencies/main-process/${hash}`)
  }
  const extensionHostPath = Path.absolute('packages/main-process')
  const NpmDependencies = await import('../NpmDependencies/NpmDependencies.js')
  const NodeModulesIgnoredFiles = await import(
    '../NodeModulesIgnoredFiles/NodeModulesIgnoredFiles.js'
  )
  await Copy.copyFile({
    from: 'packages/main-process/package.json',
    to: `build/.tmp/cachedDependencies/main-process/${hash}/package.json`,
  })
  await Copy.copyFile({
    from: 'packages/main-process/package-lock.json',
    to: `build/.tmp/cachedDependencies/main-process/${hash}/package-lock.json`,
  })
  const dependencies = await NpmDependencies.getNpmDependencies(
    'packages/main-process'
  )
  for (const dependency of dependencies) {
    const to =
      'build/.tmp/cachedDependencies/main-process/' +
      hash +
      dependency.slice(extensionHostPath.length)
    await Copy.copy({
      from: dependency,
      to,
      ignore: NodeModulesIgnoredFiles.getNodeModulesIgnoredFiles(),
    })
  }
  return `build/.tmp/cachedDependencies/main-process/${hash}`
}
