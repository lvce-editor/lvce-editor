import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'

const getHiddenDependencyPath = (path, dependency) => {
  let currentPath = path
  while (true) {
    const candidatePath = join(currentPath, 'node_modules', dependency)
    if (existsSync(candidatePath)) {
      return candidatePath
    }
    const parentPath = dirname(currentPath)
    if (parentPath === currentPath) {
      return candidatePath
    }
    currentPath = parentPath
  }
}

export const walkDependencies = (object, fn) => {
  const shouldContinue = fn(object)
  if (!shouldContinue) {
    return
  }
  if (!object.dependencies) {
    if (!object._dependencies) {
      return
    }
    const hiddenDependencies = Object.keys(object._dependencies)
    for (const hiddenDependency of hiddenDependencies) {
      walkDependencies(
        {
          path: getHiddenDependencyPath(object.path, hiddenDependency),
          name: hiddenDependency,
        },
        fn,
      )
    }
    return
  }
  const visibleDependencies = Object.values(object.dependencies)
  for (const value of visibleDependencies) {
    walkDependencies(value, fn)
  }
}
