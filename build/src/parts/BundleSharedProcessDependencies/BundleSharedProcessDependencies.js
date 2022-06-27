import { existsSync } from 'fs'
import * as Copy from '../Copy/Copy.js'
import * as Hash from '../Hash/Hash.js'
import * as Path from '../Path/Path.js'
import * as ReadFile from '../ReadFile/ReadFile.js'
import * as Remove from '../Remove/Remove.js'

export const bundleSharedProcessDependencies = async ({ cache = false }) => {
  const packageLockJson = await ReadFile.readFile(
    'packages/shared-process/package-lock.json'
  )
  const hash = Hash.computeHash(packageLockJson)
  if (
    cache &&
    existsSync(
      Path.absolute(`build/.tmp/cachedDependencies/shared-process/${hash}`)
    )
  ) {
    return Path.absolute(`build/.tmp/cachedDependencies/shared-process/${hash}`)
  }
  const projectPath = Path.absolute('packages/shared-process')
  const NpmDependencies = await import('../NpmDependencies/NpmDependencies.js')
  const NodeModulesIgnoredFiles = await import(
    '../NodeModulesIgnoredFiles/NodeModulesIgnoredFiles.js'
  )
  await Copy.copyFile({
    from: 'packages/shared-process/package.json',
    to: `build/.tmp/cachedDependencies/shared-process/${hash}/package.json`,
  })
  await Copy.copyFile({
    from: 'packages/shared-process/package-lock.json',
    to: `build/.tmp/cachedDependencies/shared-process/${hash}/package-lock.json`,
  })
  const dependencies = await NpmDependencies.getNpmDependencies(
    'packages/shared-process'
  )
  const directDependencies = dependencies.filter((dependency) =>
    dependency.startsWith(projectPath)
  )
  for (const dependency of directDependencies) {
    const to =
      'build/.tmp/cachedDependencies/shared-process/' +
      hash +
      dependency.slice(projectPath.length)
    await Copy.copy({
      from: dependency,
      to,
      ignore: NodeModulesIgnoredFiles.getNodeModulesIgnoredFiles(),
    })
  }
  const pathsToRemove = [
    'node_modules/@types',
    'node_modules/@lvce-editor',
    'node_modules/type-fest',
  ]
  for (const pathToRemove of pathsToRemove) {
    await Remove.remove(
      'build/.tmp/cachedDependencies/shared-process/' +
        hash +
        '/' +
        pathToRemove
    )
  }
  return `build/.tmp/cachedDependencies/shared-process/${hash}`
}

bundleSharedProcessDependencies({
  cache: false,
})
