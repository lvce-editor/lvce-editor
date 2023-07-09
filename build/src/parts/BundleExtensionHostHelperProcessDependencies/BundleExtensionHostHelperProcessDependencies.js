import * as CopyDependencies from '../CopyDependencies/CopyDependencies.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as NpmDependencies from '../NpmDependencies/NpmDependencies.js'
import * as Path from '../Path/Path.js'

export const bundleExtensionHostHelperProcessDependencies = async ({ to }) => {
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
  const dependencies = await NpmDependencies.getNpmDependencies('packages/extension-host-helper-process')
  await CopyDependencies.copyDependencies(extensionHostPath, to, dependencies)
}
