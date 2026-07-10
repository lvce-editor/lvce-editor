import * as CopyDependencies from '../CopyDependencies/CopyDependencies.ts'
import * as FilterExtensionHostHelperProcessDependencies from '../FilterExtensionHostHelperProcessDependencies/FilterExtensionHostHelperProcessDependencies.ts'
import * as JsonFile from '../JsonFile/JsonFile.ts'
import * as NpmDependencies from '../NpmDependencies/NpmDependencies.ts'
import * as Path from '../Path/Path.ts'

/**
 *
 * @param {*} param0
 */
export const bundleExtensionHostHelperProcessDependencies = async ({ to, exclude = [] as any[] }) => {
  const extensionHostPath = Path.absolute('packages/extension-host-helper-process')
  const packageJson = await JsonFile.readJson('packages/extension-host-helper-process/package.json')
  await JsonFile.writeJson({
    to: `${to}/package.json`,
    value: {
      name: packageJson.name,
      type: packageJson.type,
      dependencies: packageJson.dependencies,
    },
  })
  const rawDependencies = await NpmDependencies.getNpmDependenciesRawJson('packages/extension-host-helper-process')
  const filteredDependencies = FilterExtensionHostHelperProcessDependencies.filterDependencies(rawDependencies, exclude)
  await CopyDependencies.copyDependencies(extensionHostPath, to, filteredDependencies)
}
