import * as Copy from '../Copy/Copy.ts'
import * as NodeModulesIgnoredFiles from '../NodeModulesIgnoredFiles/NodeModulesIgnoredFiles.ts'
import { join, sep } from 'node:path'

const getDependencyRelativePath = (dependency) => {
  const marker = `${sep}node_modules${sep}`
  const index = dependency.indexOf(marker)
  if (index === -1) {
    throw new Error(`dependency path does not contain node_modules: ${dependency}`)
  }
  return dependency.slice(index + 1)
}

export const copyDependencies = async (projectPath, to, npmDependencies) => {
  for (const dependency of npmDependencies) {
    const dependencyTo = join(to, getDependencyRelativePath(dependency))
    await Copy.copy({
      from: dependency,
      to: dependencyTo,
      dereference: true,
      ignore: NodeModulesIgnoredFiles.getNodeModulesIgnoredFiles(),
    })
  }
}
