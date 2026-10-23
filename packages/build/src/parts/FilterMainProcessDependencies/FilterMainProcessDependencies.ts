import * as WalkDependencies from '../WalkDependencies/WalkDependencies.ts'

const bundledMainProcessDependencies = new Set(['@electron/get', '@electron-internal/extract-zip'])

export const filterPackageDependencies = (dependencies, bundleMainProcess) => {
  if (!bundleMainProcess) {
    return dependencies
  }
  return Object.fromEntries(Object.entries(dependencies).filter(([name]) => bundledMainProcessDependencies.has(name)))
}

export const filterDependencies = (rawDependencies, supportsAutoUpdate, bundleMainProcess) => {
  const dependencyPaths: any[] = []
  if (bundleMainProcess) {
    const handleBundledDependency = (dependency, includeParent) => {
      if (!dependency.path || !dependency.name || dependency.name.includes('@types')) {
        return false
      }
      const includeDependency = includeParent || bundledMainProcessDependencies.has(dependency.name)
      if (includeDependency) {
        dependencyPaths.push(dependency.path)
      }
      return includeDependency
    }
    WalkDependencies.walkDependenciesWithIncludedParents(rawDependencies, handleBundledDependency)
    return [...new Set(dependencyPaths)]
  }
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
