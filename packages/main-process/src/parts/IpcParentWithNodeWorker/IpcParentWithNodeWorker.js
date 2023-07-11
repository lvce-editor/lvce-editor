import { IpcError } from '../IpcError/IpcError.js'
import { Worker } from 'node:worker_threads'
import * as Assert from '../Assert/Assert.cjs'
import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js'
import * as GetFirstNodeWorkerEvent from '../GetFirstNodeWorkerEvent/GetFirstNodeWorkerEvent.js'

export const create = async ({ path, argv = [], env = process.env, execArgv = [] }) => {
  Assert.string(path)
  const actualArgv = ['--ipc-type=node-worker', ...argv]
  const actualEnv = {
    ...env,
    ELECTRON_RUN_AS_NODE: '1',
  }
  const worker = new Worker(path, {
    argv: actualArgv,
    env: actualEnv,
    execArgv,
  })
  const { type, event } = await GetFirstNodeWorkerEvent.getFirstNodeWorkerEvent(worker)
  if (type === FirstNodeWorkerEventType.Exit) {
    throw new IpcError(`Worker exited before ipc connection was established`)
  }
  if (type === FirstNodeWorkerEventType.Error) {
    throw new IpcError(`Worker threw an error before ipc connection was established: ${event}`)
  }
  if (event !== 'ready') {
    throw new IpcError('unexpected first message from worker')
  }
  return worker
}

export const wrap = (worker) => {
  return {
    worker,
    on(event, listener) {
      this.worker.on(event, listener)
    },
    send(message) {
      this.worker.postMessage(message)
    },
    sendAndTransfer(message, transfer) {
      Assert.array(transfer)
      this.worker.postMessage(message, transfer)
    },
    dispose() {
      this.worker.terminate()
    },
  }
}
