import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as ReadFile from '../ReadFile/ReadFile.js'
import * as Hash from '../Hash/Hash.js'
import { existsSync } from 'fs'
import * as Remove from '../Remove/Remove.js'
import * as Platform from '../Platform/Platform.js'

const getNodePtyIgnoreFiles = () => {
  const files = ['typings', 'README.md', 'scripts', 'src']
  if (!Platform.isWindows()) {
    files.push('deps')
  }
  return files
}

export const bundlePtyHostDependencies = async ({
  cache = false,
  arch,
  electronVersion,
}) => {
  if (typeof arch !== 'string') {
    throw new Error('arch must be defined')
  }
  if (typeof electronVersion !== 'string') {
    throw new Error('electron version must be defined')
  }
  const packageLockJson = await ReadFile.readFile(
    'packages/pty-host/package-lock.json'
  )
  const hash = Hash.computeHash(packageLockJson)
  if (
    cache &&
    existsSync(Path.absolute(`build/.tmp/cachedDependencies/pty-host/${hash}`))
  ) {
    return Path.absolute(`build/.tmp/cachedDependencies/pty-host/${hash}`)
  }
  const ptyHostPath = Path.absolute('packages/pty-host')
  const NpmDependencies = await import('../NpmDependencies/NpmDependencies.js')
  const NodeModulesIgnoredFiles = await import(
    '../NodeModulesIgnoredFiles/NodeModulesIgnoredFiles.js'
  )

  await Copy.copyFile({
    from: 'packages/pty-host/package.json',
    to: `build/.tmp/cachedDependencies/pty-host/${hash}/package.json`,
  })
  await Copy.copyFile({
    from: 'packages/pty-host/package-lock.json',
    to: `build/.tmp/cachedDependencies/pty-host/${hash}/package-lock.json`,
  })
  const dependencies = await NpmDependencies.getNpmDependencies(
    'packages/pty-host'
  )
  for (const dependency of dependencies) {
    const to =
      'build/.tmp/cachedDependencies/pty-host/' +
      hash +
      dependency.slice(ptyHostPath.length)
    await Copy.copy({
      from: dependency,
      to,
      ignore: NodeModulesIgnoredFiles.getNodeModulesIgnoredFiles(),
    })
  }
  const Rebuild = await import('../Rebuild/Rebuild.js')
  await Rebuild.rebuild({
    arch,
    buildPath: Path.absolute(`build/.tmp/cachedDependencies/pty-host/${hash}`),
    electronVersion: '19.0.6',
  })
  const nodePtyIgnoreFiles = getNodePtyIgnoreFiles()
  for (const file of nodePtyIgnoreFiles) {
    await Remove.remove(
      Path.absolute(
        `build/.tmp/cachedDependencies/pty-host/${hash}/node_modules/node-pty/${file}`
      )
    )
  }
  return `build/.tmp/cachedDependencies/pty-host/${hash}`
}
