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

const getElsProblemMessage = (message) => {
  const lines = message.split('\n')
  for (const line of lines) {
    if (line.includes('npm ERR! invalid:')) {
      return line
    }
  }
  return message
}

const trimLine = (line) => {
  return line.trim()
}

const getNpmDependenciesRaw = async (root) => {
  try {
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
    const lines = stdout.split('\n').map(trimLine)
    return lines.slice(1)
  } catch (error) {
    if (error && error.message.includes('ELSPROBLEMS')) {
      const message = getElsProblemMessage(error.message)
      throw new VError(`Failed to get npm dependencies for ${root}: ${message}`)
    }
    // @ts-ignore
    throw new VError(error, `Failed to get npm dependencies for ${root}`)
  }
}

export const getNpmDependenciesRawJson = async (root) => {
  try {
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
  } catch (error) {
    if (error && error.message.includes('ELSPROBLEMS')) {
      const message = getElsProblemMessage(error.message)
      throw new VError(`Failed to get npm dependencies for ${root}: ${message}`)
    }
    // @ts-ignore
    throw new VError(error, `Failed to get npm dependencies for ${root}`)
  }
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
