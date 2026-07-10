import * as WalkDependencies from '../WalkDependencies/WalkDependencies.ts'

export const filterDependencies = (rawDependencies, exclude = [] as any[]) => {
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
    if (exclude.includes(dependency.name)) {
      return false
    }
    dependencyPaths.push(dependency.path)
    return true
  }
  WalkDependencies.walkDependencies(rawDependencies, handleDependency)
  return dependencyPaths.slice(1)
}
