const { Worker } = require('node:worker_threads')

const create = (url, options) => {
  const worker = new Worker(url, options)
  return {
    worker,
    on(event, listener) {
      this.worker.on(event, listener)
    },
    postMessage(message) {
      this.worker.postMessage(message)
    },
  }
}

exports.create = create
