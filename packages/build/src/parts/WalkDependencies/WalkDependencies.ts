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

const visitDependencies = (object, fn) => {
  const shouldContinue = fn(object)
  if (!shouldContinue) {
    return
  }
  const visibleDependencies = Object.values(object.dependencies || {})
  for (const value of visibleDependencies) {
    visitDependencies(value, fn)
  }

  // npm does not include optional dependencies in `dependencies` when they
  // are hoisted. Resolve declarations that are not visible in the tree from
  // the package that declares them so they are included in the bundle.
  const hiddenDependencies = Object.keys(object._dependencies || {}).filter((dependency) => {
    return !object.dependencies?.[dependency]
  })
  for (const hiddenDependency of hiddenDependencies) {
    visitDependencies(
      {
        path: getHiddenDependencyPath(object.path, hiddenDependency),
        name: hiddenDependency,
      },
      fn,
    )
  }
}

const visitAllDependencies = (object, fn, includeParent = false) => {
  const includeDependency = fn(object, includeParent)
  const include = includeParent || includeDependency
  const visibleDependencies = Object.values(object.dependencies || {})
  for (const value of visibleDependencies) {
    visitAllDependencies(value, fn, include)
  }
  const hiddenDependencies = Object.keys(object._dependencies || {}).filter((dependency) => {
    return !object.dependencies?.[dependency]
  })
  for (const hiddenDependency of hiddenDependencies) {
    visitAllDependencies(
      {
        path: getHiddenDependencyPath(object.path, hiddenDependency),
        name: hiddenDependency,
      },
      fn,
      include,
    )
  }
}

export const walkDependenciesWithIncludedParents = (object, fn) => {
  visitAllDependencies(object, fn)
}

export const walkDependencies = (object, fn) => {
  visitDependencies(object, fn)
}
