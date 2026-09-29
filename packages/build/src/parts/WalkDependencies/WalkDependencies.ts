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
  const visibleDependencies = Object.values(object.dependencies || {})
  for (const value of visibleDependencies) {
    walkDependencies(value, fn)
  }

  // npm does not include optional dependencies in `dependencies` when they
  // are hoisted. Resolve declarations that are not visible in the tree from
  // the package that declares them so they are included in the bundle.
  const hiddenDependencies = Object.keys(object._dependencies || {}).filter((dependency) => {
    return !object.dependencies?.[dependency]
  })
  for (const hiddenDependency of hiddenDependencies) {
    walkDependencies(
      {
        path: getHiddenDependencyPath(object.path, hiddenDependency),
        name: hiddenDependency,
      },
      fn,
    )
  }
}
