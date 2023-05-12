import { spawn } from 'node:child_process'
import * as IsElectron from '../IsElectron/IsElectron.js'
import * as Path from '../Path/Path.js'
import * as Root from '../Root/Root.js'
import { VError } from '../VError/VError.js'

const getElectronRebuildPath = () => {
  return Path.join(Root.root, 'packages', 'main-process', 'node_modules', '.bin', 'electron-rebuild')
}

const getPtyHostPath = () => {
  return Path.join(Root.root, 'packages', 'pty-host')
}

/**
 * @param {string} cwd
 */
const rebuildNodePtyElectron = async (cwd) => {
  const electronRebuildPath = getElectronRebuildPath()
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

export const rebuildNodePty = async () => {
  try {
    const ptyHostPath = getPtyHostPath()
    if (IsElectron.isElectron()) {
      await rebuildNodePtyElectron(ptyHostPath)
    } else {
      await rebuildNodePtyNode(ptyHostPath)
    }
  } catch (error) {
    throw new VError(error, `Failed to rebuild node-pty`)
  }
}
