import * as Copy from '../Copy/Copy.js'
import * as FilterMainProcessDependencies from '../FilterMainProcessDependencies/FilterMainProcessDependencies.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as NodeModulesIgnoredFiles from '../NodeModulesIgnoredFiles/NodeModulesIgnoredFiles.js'
import * as NpmDependencies from '../NpmDependencies/NpmDependencies.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'

export const bundleMainProcessDependencies = async ({ to, arch, electronVersion, supportsAutoUpdate }) => {
  const mainProcessPath = Path.absolute('packages/main-process')
  const packageJson = await JsonFile.readJson('packages/main-process/package.json')
  await JsonFile.writeJson({
    to: `${to}/package.json`,
    value: {
      name: packageJson.name,
      type: packageJson.type,
      dependencies: packageJson.dependencies,
    },
  })
  const npmDependenciesRaw = await NpmDependencies.getNpmDependenciesRawJson('packages/main-process')
  const npmDependencies = FilterMainProcessDependencies.filterDependencies(npmDependenciesRaw, supportsAutoUpdate)
  for (const dependency of npmDependencies) {
    const dependencyTo = to + dependency.slice(mainProcessPath.length)
    await Copy.copy({
      from: dependency,
      to: dependencyTo,
      ignore: NodeModulesIgnoredFiles.getNodeModulesIgnoredFiles(),
    })
  }
  if (Platform.isWindows()) {
    const Rebuild = await import('../Rebuild/Rebuild.js')
    await Rebuild.rebuild({
      arch,
      buildPath: Path.absolute(to),
      electronVersion,
    })
  }
}
