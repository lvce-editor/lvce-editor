import * as Copy from '../Copy/Copy.js'
import * as NodeModulesIgnoredFiles from '../NodeModulesIgnoredFiles/NodeModulesIgnoredFiles.js'
import * as NpmDependencies from '../NpmDependencies/NpmDependencies.js'
import * as Path from '../Path/Path.js'

export const bundleMainProcessDependencies = async ({ to }) => {
  const mainProcessPath = Path.absolute('packages/main-process')
  await Copy.copyFile({
    from: 'packages/main-process/package.json',
    to: `${to}/package.json`,
  })
  await Copy.copyFile({
    from: 'packages/main-process/package-lock.json',
    to: `${to}/package-lock.json`,
  })
  const dependencies = await NpmDependencies.getNpmDependencies(
    'packages/main-process'
  )
  for (const dependency of dependencies) {
    const dependencyTo = to + dependency.slice(mainProcessPath.length)
    await Copy.copy({
      from: dependency,
      to: dependencyTo,
      ignore: NodeModulesIgnoredFiles.getNodeModulesIgnoredFiles(),
    })
  }
}
