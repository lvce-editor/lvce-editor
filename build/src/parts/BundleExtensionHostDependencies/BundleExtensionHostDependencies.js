import { existsSync } from 'fs'
import * as Copy from '../Copy/Copy.js'
import * as Hash from '../Hash/Hash.js'
import * as Path from '../Path/Path.js'
import * as ReadFile from '../ReadFile/ReadFile.js'

export const bundleExtensionHostDependencies = async ({ cache = false }) => {
  const packageLockJson = await ReadFile.readFile(
    'packages/pty-host/package-lock.json'
  )
  const hash = Hash.computeHash(packageLockJson)
  if (
    cache &&
    existsSync(
      Path.absolute(`build/.tmp/cachedDependencies/extension-host/${hash}`)
    )
  ) {
    return Path.absolute(`build/.tmp/cachedDependencies/extension-host/${hash}`)
  }
  const extensionHostPath = Path.absolute('packages/extension-host')
  const NpmDependencies = await import('../NpmDependencies/NpmDependencies.js')
  const NodeModulesIgnoredFiles = await import(
    '../NodeModulesIgnoredFiles/NodeModulesIgnoredFiles.js'
  )
  await Copy.copyFile({
    from: 'packages/extension-host/package.json',
    to: `build/.tmp/cachedDependencies/extension-host/${hash}/package.json`,
  })
  await Copy.copyFile({
    from: 'packages/extension-host/package-lock.json',
    to: `build/.tmp/cachedDependencies/extension-host/${hash}/package-lock.json`,
  })
  const dependencies = await NpmDependencies.getNpmDependencies(
    'packages/extension-host'
  )
  for (const dependency of dependencies) {
    const to =
      'build/.tmp/cachedDependencies/extension-host/' +
      hash +
      dependency.slice(extensionHostPath.length)
    await Copy.copy({
      from: dependency,
      to,
      ignore: NodeModulesIgnoredFiles.getNodeModulesIgnoredFiles(),
    })
  }
  return `build/.tmp/cachedDependencies/extension-host/${hash}`
}
