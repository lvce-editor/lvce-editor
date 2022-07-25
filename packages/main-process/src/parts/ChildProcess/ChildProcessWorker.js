import { Worker } from 'node:worker_threads'

export const create = (url, options) => {
  const worker = new Worker(url, options)
  return {
    on(event, listener) {
      switch (event) {
        case 'error':
          worker.on('error', listener)
          break
        case 'message':
          worker.on('message', listener)
          break
        case 'exit':
          worker.on('exit', listener)
          break
        default:
          throw new Error('unsupported event type')
      }
    },
    dispose() {
      worker.terminate()
    },
  }
}
