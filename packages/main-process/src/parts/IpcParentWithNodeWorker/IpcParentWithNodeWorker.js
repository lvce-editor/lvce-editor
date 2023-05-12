const { IpcError } = require('../IpcError/IpcError.js')
const { Worker } = require('node:worker_threads')
const Assert = require('../Assert/Assert.js')
const FirstNodeWorkerEventType = require('../FirstNodeWorkerEventType/FirstNodeWorkerEventType.js')
const GetFirstNodeWorkerEvent = require('../GetFirstNodeWorkerEvent/GetFirstNodeWorkerEvent.js')

exports.create = async ({ path, argv, env, execArgv }) => {
  Assert.string(path)
  const worker = new Worker(path, {
    argv,
    env,
    execArgv,
  })
  const { type, event } = await GetFirstNodeWorkerEvent.getFirstNodeWorkerEvent(worker)
  if (type === FirstNodeWorkerEventType.Exit) {
    throw new IpcError(`Worker exited before ipc connection was established`)
  }
  if (type === FirstNodeWorkerEventType.Error) {
    throw new IpcError(`Worker threw an error before ipc connection was established`)
  }
  if (event !== 'ready') {
    throw new IpcError('unexpected first message from worker')
  }
  return worker
}

exports.wrap = (worker) => {
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
