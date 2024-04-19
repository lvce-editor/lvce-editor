import * as CopyDependencies from '../CopyDependencies/CopyDependencies.js'
import * as FilterEmbedsProcessDependencies from '../FilterEmbedsProcessDependencies/FilterEmbedsProcessDependencies.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as NpmDependencies from '../NpmDependencies/NpmDependencies.js'
import * as Path from '../Path/Path.js'

export const bundleEmbedsProcessDependencies = async ({ to, arch, electronVersion, exclude = [], platform = process.platform }) => {
  const projectPath = Path.absolute('packages/embeds-process')
  const npmDependenciesRaw = await NpmDependencies.getNpmDependenciesRawJson(projectPath)
  const npmDependencies = FilterEmbedsProcessDependencies.filterDependencies(npmDependenciesRaw, exclude)
  const packageJson = await JsonFile.readJson('packages/embeds-process/package.json')
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
}
