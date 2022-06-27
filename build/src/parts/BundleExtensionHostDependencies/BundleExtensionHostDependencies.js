import * as Copy from '../Copy/Copy.js'
import * as NodeModulesIgnoredFiles from '../NodeModulesIgnoredFiles/NodeModulesIgnoredFiles.js'
import * as NpmDependencies from '../NpmDependencies/NpmDependencies.js'
import * as Path from '../Path/Path.js'

export const bundleExtensionHostDependencies = async ({ to }) => {
  const extensionHostPath = Path.absolute('packages/extension-host')
  await Copy.copyFile({
    from: 'packages/extension-host/package.json',
    to: `${to}/package.json`,
  })
  await Copy.copyFile({
    from: 'packages/extension-host/package-lock.json',
    to: `${to}/package-lock.json`,
  })
  const dependencies = await NpmDependencies.getNpmDependencies(
    'packages/extension-host'
  )
  for (const dependency of dependencies) {
    const dependencyTo = to + dependency.slice(extensionHostPath.length)
    await Copy.copy({
      from: dependency,
      to: dependencyTo,
      ignore: NodeModulesIgnoredFiles.getNodeModulesIgnoredFiles(),
    })
  }
}
