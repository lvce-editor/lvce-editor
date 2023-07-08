import * as WalkDependencies from '../WalkDependencies/WalkDependencies.js'

export const filterDependencies = (rawDependencies, exclude = []) => {
  const dependencyPaths = []
  const handleDependency = (dependency) => {
    if (!dependency.path) {
      return false
    }
    if (!dependency.name) {
      return false
    }
    if (dependency.name === '@lvce-editor/extension-host') {
      return false
    }
    if (dependency.name === '@lvce-editor/pty-host') {
      return false
    }
    if (dependency.name === 'prebuild-install') {
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
    if (dependency.name === 'vscode-ripgrep-with-github-api-error-fix') {
      dependencyPaths.push(dependency.path)
      return false
    }
    dependencyPaths.push(dependency.path)
    return true
  }
  WalkDependencies.walkDependencies(rawDependencies, handleDependency)
  return dependencyPaths.slice(1)
}
