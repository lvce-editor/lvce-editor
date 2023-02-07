const Assert = require('../Assert/Assert.js')
const { Worker } = require('node:worker_threads')
const GetFirstNodeWorkerEvent = require('../GetFirstNodeWorkerEvent/GetFirstNodeWorkerEvent.js')

exportss.create = async ({ url }) => {
  Assert.string(url)
  const worker = new Worker(url)
  const { type, event } = await GetFirstNodeWorkerEvent.getFirstNodeWorkerEvent(worker)
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
  }
}
