import { spawn } from 'node:child_process'
import * as GetElectronRebuildPath from '../GetElectronRebuildPath/GetElectronRebuildPath.js'
import * as IsElectron from '../IsElectron/IsElectron.js'
import * as Path from '../Path/Path.js'
import * as Root from '../Root/Root.js'
import { VError } from '../VError/VError.js'

const getPtyHostPath = () => {
  return Path.join(Root.root, 'packages', 'pty-host')
}

/**
 * @param {string} cwd
 */
const rebuildNodePtyElectron = async (cwd) => {
  const electronRebuildPath = GetElectronRebuildPath.getElectronRebuildPath()
  const childProcess = spawn(electronRebuildPath, [], {
    cwd,
    stdio: 'inherit',
  })
  // TODO wait for child process to be finished
}

/**
 * @param {string} cwd
 */
const rebuildNodePtyNode = async (cwd) => {
  const childProcess = spawn('npm', ['rebuild'], {
    cwd,
    stdio: 'inherit',
  })
}

const getFn = () => {
  if (IsElectron.isElectron()) {
    return rebuildNodePtyElectron
  }
  return rebuildNodePtyNode
}

export const rebuildNodePty = async () => {
  try {
    const ptyHostPath = getPtyHostPath()
    const rebuild = getFn()
    await rebuild(ptyHostPath)
  } catch (error) {
    throw new VError(error, `Failed to rebuild node-pty`)
  }
}
