import { VError } from '../VError/VError.js'
import * as Path from '../Path/Path.js'
import * as Root from '../Root/Root.js'
import { spawn } from 'child_process'

const getElectronRebuildPath = () => {
  return Path.join(Root.root, 'packages', 'main-process', 'node_modules', '.bin', 'electron-rebuild')
}

const getPtyHostPath = () => {
  return Path.join(Root.root, 'packages', 'pty-host')
}

/**
 *
 * @param {string} electronRebuildPath
 * @param {string[]} args
 * @param {import('child_process').SpawnOptions} options
 */
const runElectronRebuild = async (electronRebuildPath, args, options) => {
  const childProcess = spawn(electronRebuildPath, args, options)
  // TODO wait for child process to be finished
}

export const rebuildNodePty = async () => {
  try {
    const electronRebuildPath = getElectronRebuildPath()
    const ptyHostPath = getPtyHostPath()
    await runElectronRebuild(electronRebuildPath, [], {
      cwd: ptyHostPath,
      stdio: 'inherit',
    })
  } catch (error) {
    throw new VError(error, `Failed to rebuild node-pty`)
  }
}
