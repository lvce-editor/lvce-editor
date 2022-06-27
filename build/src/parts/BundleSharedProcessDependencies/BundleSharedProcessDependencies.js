import * as Copy from '../Copy/Copy.js'
import * as Exec from '../Exec/Exec.js'
import * as JsonFile from '../JsonFile/JsonFile.js'
import * as NodeModulesIgnoredFiles from '../NodeModulesIgnoredFiles/NodeModulesIgnoredFiles.js'
import * as Path from '../Path/Path.js'

const getNpmDependenciesRaw = async (root) => {
  const absoluteRoot = Path.absolute(root)
  const { stdout } = await Exec.exec(
    'npm',
    ['list', '--omit=dev', '--all', '--json', '--long'],
    {
      cwd: absoluteRoot,
    }
  )
  const json = JSON.parse(stdout)
  return json
}

const walkDependencies = (object, fn) => {
  const shouldContinue = fn(object)
  if (!shouldContinue) {
    return
  }
  if (!object.dependencies) {
    return
  }
  for (const value of Object.values(object.dependencies)) {
    walkDependencies(value, fn)
  }
}

const getNpmDependencies = (rawDependencies) => {
  rawDependencies
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
    if (dependency.name === 'vscode-ripgrep-with-github-api-error-fix') {
      dependencyPaths.push(dependency.path)
      return false
    }
    dependencyPaths.push(dependency.path)
    return true
  }
  walkDependencies(rawDependencies, handleDependency)
  return dependencyPaths.slice(1)
}

export const bundleSharedProcessDependencies = async ({ to }) => {
  const projectPath = Path.absolute('packages/shared-process')
  const npmDependenciesRaw = await getNpmDependenciesRaw(projectPath)
  const npmDependencies = getNpmDependencies(npmDependenciesRaw)
  const packageJson = await JsonFile.readJson(
    'packages/shared-process/package.json'
  )
  await JsonFile.writeJson({
    to: `${to}/package.json`,
    value: {
      name: packageJson.name,
      type: packageJson.type,
      dependencies: packageJson.dependencies,
      optionalDependencies: packageJson.optionalDependencies,
    },
  })
  await Copy.copyFile({
    from: 'packages/shared-process/package.json',
    to: `${to}/package.json`,
  })

  for (const dependency of npmDependencies) {
    const dependencyTo = to + dependency.slice(projectPath.length)
    await Copy.copy({
      from: dependency,
      to: dependencyTo,
      ignore: NodeModulesIgnoredFiles.getNodeModulesIgnoredFiles(),
    })
  }
}
