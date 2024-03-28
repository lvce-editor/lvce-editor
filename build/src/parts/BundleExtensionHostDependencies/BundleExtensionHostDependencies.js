import * as CopyDependencies from '../CopyDependencies/CopyDependencies.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as NpmDependencies from '../NpmDependencies/NpmDependencies.js'
import * as Path from '../Path/Path.js'

export const bundleExtensionHostDependencies = async ({ to }) => {
  const extensionHostPath = Path.absolute('packages/extension-host')
  const packageJson = await JsonFile.readJson('packages/extension-host/package.json')
  await JsonFile.writeJson({
    to: `${to}/package.json`,
    value: {
      name: packageJson.name,
      type: packageJson.type,
      dependencies: packageJson.dependencies,
    },
  })
  const dependencies = await NpmDependencies.getNpmDependencies('packages/extension-host')
  await CopyDependencies.copyDependencies(extensionHostPath, to, dependencies)
}
