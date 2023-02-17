import * as Assert from '../Assert/Assert.js'
import { fork } from 'node:child_process'
import * as GetFirstNodeChildProcessEvent from '../GetFirstNodeChildProcessEvent/GetFirstNodeChildProcessEvent.js'
import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js'
import VError from 'verror'

export const create = async ({ path, argv, env, execArgv }) => {
  try {
    Assert.string(path)
    const childProcess = fork(path, argv, {
      env,
      execArgv,
    })
    const { type, event } = await GetFirstNodeChildProcessEvent.getFirstNodeChildProcessEvent(childProcess)
    if (type === FirstNodeWorkerEventType.Exit) {
      throw new Error(`child process exited with code ${event}`)
    }
    if (type === FirstNodeWorkerEventType.Error) {
      throw new Error(`child process had an error ${event}`)
    }
    return childProcess
  } catch (error) {
    throw new VError(error, `Failed to create child process`)
  }
}

export const wrap = (childProcess) => {
  return {
    childProcess,
    on(event, listener) {
      this.childProcess.on(event, listener)
    },
    send(message) {
      this.childProcess.send(message)
    },
    sendAndTransfer(message, transfer) {
      throw new Error('transfer is not supported')
    },
    dispose() {
      this.childProcess.kill()
    },
  }
}
