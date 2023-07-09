import * as CopyDependencies from '../CopyDependencies/CopyDependencies.js'
import * as FilterSharedProcessDependencies from '../FilterSharedProcessDependencies/FilterSharedProcessDependencies.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as NpmDependencies from '../NpmDependencies/NpmDependencies.js'
import * as Path from '../Path/Path.js'
import * as Platform from '../Platform/Platform.js'
import * as Remove from '../Remove/Remove.js'

export const bundleSharedProcessDependencies = async ({ to, arch, electronVersion, exclude = [] }) => {
  const projectPath = Path.absolute('packages/shared-process')
  const npmDependenciesRaw = await NpmDependencies.getNpmDependenciesRawJson(projectPath)
  const npmDependencies = FilterSharedProcessDependencies.filterDependencies(npmDependenciesRaw, exclude)
  const packageJson = await JsonFile.readJson('packages/shared-process/package.json')
  await JsonFile.writeJson({
    to: `${to}/package.json`,
    value: {
      name: packageJson.name,
      type: packageJson.type,
      dependencies: packageJson.dependencies,
      optionalDependencies: packageJson.optionalDependencies,
    },
  })
  await CopyDependencies.copyDependencies(projectPath, to, npmDependencies)
  if (Platform.isWindows()) {
    const Rebuild = await import('../Rebuild/Rebuild.js')
    await Rebuild.rebuild({
      arch,
      buildPath: Path.absolute(to),
      electronVersion,
    })
  } else {
    await Remove.remove(Path.absolute(`${to}/node_modules/@vscode/windows-process-tree`))
    await Remove.remove(Path.absolute(`${to}/node_modules/nan`))
  }
  await Remove.remove(Path.absolute(`${to}/node_modules/uuid/dist/esm-browser`))
  await Remove.remove(Path.absolute(`${to}/node_modules/uuid/dist/umd`))
  await Remove.remove(Path.absolute(`${to}/node_modules/uuid/dist/bin`))
  await Remove.removeMatching(`${to}/node_modules`, '**/*.d.ts')
}
