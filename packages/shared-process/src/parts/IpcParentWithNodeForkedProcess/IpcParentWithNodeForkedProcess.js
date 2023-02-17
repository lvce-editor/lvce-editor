import * as Assert from '../Assert/Assert.js'
import { fork } from 'node:child_process'
import * as GetFirstNodeChildProcessEvent from '../GetFirstNodeChildProcessEvent/GetFirstNodeChildProcessEvent.js'
import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js'

export const create = async ({ path, argv, env, execArgv }) => {
  Assert.string(path)
  const childProcess = fork(path, argv, {
    env,
    execArgv,
  })
  const { type, event } = await GetFirstNodeChildProcessEvent.getFirstNodeWorkerEvent(childProcess)
  if (type !== FirstNodeWorkerEventType.Message) {
    throw new Error(`failed to create child process ipc`)
  }
  return childProcess
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
