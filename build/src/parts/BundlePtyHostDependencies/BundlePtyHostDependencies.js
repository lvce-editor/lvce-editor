import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as Remove from '../Remove/Remove.js'

const getNodePtyIgnoreFiles = () => {
  const files = ['typings', 'README.md', 'scripts', 'src']
  if (!Platform.isWindows()) {
    files.push('deps')
  }
  return files
}

export const bundlePtyHostDependencies = async ({
  to,
  arch,
  electronVersion,
}) => {
  if (typeof arch !== 'string') {
    throw new Error('arch must be defined')
  }
  if (typeof electronVersion !== 'string') {
    throw new Error('electron version must be defined')
  }

  const ptyHostPath = Path.absolute('packages/pty-host')
  const NpmDependencies = await import('../NpmDependencies/NpmDependencies.js')
  const NodeModulesIgnoredFiles = await import(
    '../NodeModulesIgnoredFiles/NodeModulesIgnoredFiles.js'
  )
  await Copy.copyFile({
    from: 'packages/pty-host/package.json',
    to: `${to}/package.json`,
  })
  await Copy.copyFile({
    from: 'packages/pty-host/package-lock.json',
    to: `${to}/package-lock.json`,
  })
  const dependencies = await NpmDependencies.getNpmDependencies(
    'packages/pty-host'
  )
  for (const dependency of dependencies) {
    const dependencyTo = to + dependency.slice(ptyHostPath.length)
    await Copy.copy({
      from: dependency,
      to: dependencyTo,
      ignore: NodeModulesIgnoredFiles.getNodeModulesIgnoredFiles(),
    })
  }
  const Rebuild = await import('../Rebuild/Rebuild.js')
  await Rebuild.rebuild({
    arch,
    buildPath: Path.absolute(to),
    electronVersion: '19.0.6',
  })
  const nodePtyIgnoreFiles = getNodePtyIgnoreFiles()
  for (const file of nodePtyIgnoreFiles) {
    await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/${file}`))
  }
}
