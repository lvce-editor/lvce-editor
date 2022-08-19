import * as Copy from '../Copy/Copy.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as Remove from '../Remove/Remove.js'
import * as NpmDependencies from '../NpmDependencies/NpmDependencies.js'
import * as NodeModulesIgnoredFiles from '../NodeModulesIgnoredFiles/NodeModulesIgnoredFiles.js'
import * as JsonFile from '../JsonFile/JsonFile.js'

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
    throw new TypeError('arch must be defined')
  }
  if (typeof electronVersion !== 'string') {
    throw new TypeError('electron version must be defined')
  }
  const ptyHostPath = Path.absolute('packages/pty-host')
  const packageJson = await JsonFile.readJson('packages/pty-host/package.json')
  await JsonFile.writeJson({
    to: `${to}/package.json`,
    value: {
      name: packageJson.name,
      type: packageJson.type,
      dependencies: packageJson.dependencies,
      optionalDependencies: packageJson.optionalDependencies,
    },
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
    electronVersion,
  })
  const nodePtyIgnoreFiles = getNodePtyIgnoreFiles()
  for (const file of nodePtyIgnoreFiles) {
    await Remove.remove(Path.absolute(`${to}/node_modules/node-pty/${file}`))
  }
}
