import * as Copy from '../Copy/Copy.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as NodeModulesIgnoredFiles from '../NodeModulesIgnoredFiles/NodeModulesIgnoredFiles.js'
import * as NpmDependencies from '../NpmDependencies/NpmDependencies.js'
import * as Path from '../Path/Path.js'

export const bundleMainProcessDependencies = async ({ to }) => {
  const mainProcessPath = Path.absolute('packages/main-process')
  const packageJson = await JsonFile.readJson(
    'packages/main-process/package.json'
  )
  await JsonFile.writeJson({
    to: `${to}/package.json`,
    value: {
      name: packageJson.name,
      type: packageJson.type,
      dependencies: packageJson.dependencies,
    },
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
