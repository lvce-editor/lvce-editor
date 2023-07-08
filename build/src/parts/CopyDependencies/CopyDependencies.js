import * as Copy from '../Copy/Copy.js'
import * as NodeModulesIgnoredFiles from '../NodeModulesIgnoredFiles/NodeModulesIgnoredFiles.js'

export const copyDependencies = async (projectPath, to, npmDependencies) => {
  for (const dependency of npmDependencies) {
    const dependencyTo = to + dependency.slice(projectPath.length)
    await Copy.copy({
      from: dependency,
      to: dependencyTo,
      ignore: NodeModulesIgnoredFiles.getNodeModulesIgnoredFiles(),
    })
  }
}
