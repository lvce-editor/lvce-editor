import * as WalkDependencies from '../WalkDependencies/WalkDependencies.ts'

export const filterDependencies = (rawDependencies, supportsAutoUpdate, bundleMainProcess) => {
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
    if (bundleMainProcess && dependency.name === '@lvce-editor/main-process') {
      return true
    }
    if (bundleMainProcess && dependency.name === 'electron') {
      return false
    }
    dependencyPaths.push(dependency.path)
    return true
  }
  WalkDependencies.walkDependencies(rawDependencies, handleDependency)
  return dependencyPaths.slice(1)
}
