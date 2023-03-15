import { Worker } from 'node:worker_threads'
import * as Assert from '../Assert/Assert.js'
import * as FirstNodeWorkerEventType from '../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js'
import * as GetFirstNodeWorkerEvent from '../GetFirstNodeWorkerEvent/GetFirstNodeWorkerEvent.js'

export const create = async ({ path, argv, env, execArgv }) => {
  Assert.string(path)
  const worker = new Worker(path, {
    argv,
    env,
    execArgv,
  })
  const { type, event } = await GetFirstNodeWorkerEvent.getFirstNodeWorkerEvent(worker)
  if (type === FirstNodeWorkerEventType.Error) {
    throw event
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
      this.worker.postMessage(message, transfer)
    },
    dispose() {
      this.worker.terminate()
    },
  }
}
