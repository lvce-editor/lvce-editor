import { existsSync } from 'fs'
import * as Copy from '../Copy/Copy.js'
import * as Hash from '../Hash/Hash.js'
import * as Path from '../Path/Path.js'
import * as ReadFile from '../ReadFile/ReadFile.js'
import * as Remove from '../Remove/Remove.js'
import * as Exec from '../Exec/Exec.js'
import * as NodeModulesIgnoredFiles from '../NodeModulesIgnoredFiles/NodeModulesIgnoredFiles.js'

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
  console.log({ rawDependencies })
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
  console.log({ dependencyPaths })
  return dependencyPaths.slice(1)
}

export const bundleSharedProcessDependencies = async ({ cache = false }) => {
  const packageLockJson = await ReadFile.readFile(
    'packages/shared-process/package-lock.json'
  )
  const hash = Hash.computeHash(packageLockJson)
  if (
    cache &&
    existsSync(
      Path.absolute(`build/.tmp/cachedDependencies/shared-process/${hash}`)
    )
  ) {
    return Path.absolute(`build/.tmp/cachedDependencies/shared-process/${hash}`)
  }
  const projectPath = Path.absolute('packages/shared-process')
  const npmDependenciesRaw = await getNpmDependenciesRaw(projectPath)
  const npmDependencies = getNpmDependencies(npmDependenciesRaw)
  await Copy.copyFile({
    from: 'packages/shared-process/package.json',
    to: `build/.tmp/cachedDependencies/shared-process/${hash}/package.json`,
  })
  await Copy.copyFile({
    from: 'packages/shared-process/package-lock.json',
    to: `build/.tmp/cachedDependencies/shared-process/${hash}/package-lock.json`,
  })
  for (const dependency of npmDependencies) {
    const to =
      'build/.tmp/cachedDependencies/shared-process/' +
      hash +
      dependency.slice(projectPath.length)
    await Copy.copy({
      from: dependency,
      to,
      ignore: NodeModulesIgnoredFiles.getNodeModulesIgnoredFiles(),
    })
  }
}

bundleSharedProcessDependencies({
  cache: false,
})
