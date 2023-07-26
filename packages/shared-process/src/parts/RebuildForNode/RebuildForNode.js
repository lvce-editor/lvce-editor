import { spawn } from 'node:child_process'
import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js'
import * as GetFirstNodeChildProcessEvent from '../GetFirstNodeChildProcessEvent/GetFirstNodeChildProcessEvent.js'

/**
 * @param {string} cwd
 */
export const rebuild = async (cwd) => {
  const childProcess = spawn('npm', ['rebuild'], {
    cwd,
    stdio: 'inherit',
  })
  const { type, event } = await GetFirstNodeChildProcessEvent.getFirstNodeChildProcessEvent(childProcess)
  if (type === FirstNodeWorkerEventType.Error) {
    throw new Error(`Failed to rebuild native module: ${event}`)
  }
}
