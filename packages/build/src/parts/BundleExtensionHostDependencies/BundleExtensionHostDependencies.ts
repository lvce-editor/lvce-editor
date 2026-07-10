import * as CopyDependencies from '../CopyDependencies/CopyDependencies.ts'
import * as JsonFile from '../JsonFile/JsonFile.ts'
import * as NpmDependencies from '../NpmDependencies/NpmDependencies.ts'
import * as Path from '../Path/Path.ts'

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
