import * as Copy from '../Copy/Copy.ts'
import * as NodeModulesIgnoredFiles from '../NodeModulesIgnoredFiles/NodeModulesIgnoredFiles.ts'

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
