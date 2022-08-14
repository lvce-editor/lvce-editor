import VError from 'verror'
import * as Exec from '../Exec/Exec.js'
import * as Path from '../Path/Path.js'

const RE_NUMBER = /^\d+/

const getNodeVersionMajor = (nodeVersion) => {
  const match = nodeVersion.match(RE_NUMBER)
  if (!match) {
    throw new Error('unable to detect node version')
  }
  return match[0]
}

const getNpmDependenciesRaw = async (root) => {
  const absoluteRoot = Path.absolute(root)
  const nodeVersion = process.versions.node
  const nodeVersionMajor = getNodeVersionMajor(nodeVersion)
  if (nodeVersionMajor < 18) {
    throw new VError(
      `NodeJs Version >=18 is required but current Node version is ${nodeVersion}`
    )
  }
  const { stdout } = await Exec.exec(
    'npm',
    ['list', '--omit=dev', '--parseable', '--all'],
    {
      cwd: absoluteRoot,
    }
  )
  const lines = stdout.split('\n')
  return lines.slice(1)
}

const isDependency = (path) => {
  if (path.endsWith('type-fest')) {
    return false
  }
  return true
}

export const getNpmDependencies = async (root) => {
  const npmDependenciesRaw = await getNpmDependenciesRaw(root)
  return npmDependenciesRaw.filter(isDependency)
}
