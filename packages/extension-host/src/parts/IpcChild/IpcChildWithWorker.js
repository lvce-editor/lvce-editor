import { parentPort } from 'node:worker_threads'

export const listen = async (commandRegistry) => {
  const port = parentPort
  if (!port) {
    throw new Error('parent port not found')
  }
  return {
    send(message) {
      port.postMessage(message)
    },
    on(event, listener) {
      switch (event) {
        case 'message':
          port.on('message', listener)
          break
        default:
          throw new Error('unknown event listener type')
      }
    },
  }
}
