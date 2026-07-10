import * as WalkDependencies from '../WalkDependencies/WalkDependencies.ts'

export const filterDependencies = (rawDependencies, supportsAutoUpdate) => {
  const dependencyPaths: any[] = []
  const handleDependency = (dependency) => {
    if (!dependency.path) {
      return false
    }
    if (!dependency.name) {
      return false
    }
    if (dependency.name.includes('@types')) {
      return false
    }
    if (dependency.name === 'type-fest') {
      return false
    }
    if (dependency.name === 'electron-unhandled') {
      return false
    }
    dependencyPaths.push(dependency.path)
    return true
  }
  WalkDependencies.walkDependencies(rawDependencies, handleDependency)
  return dependencyPaths.slice(1)
}
