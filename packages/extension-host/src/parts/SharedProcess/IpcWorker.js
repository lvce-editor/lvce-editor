import { parentPort } from 'node:worker_threads'

export const send = (message) => {
  parentPort.postMessage(message)
}

export const isActive = () => {
  return Boolean(parentPort)
}

export const onMessage = (listener) => {
  parentPort.on('message', listener)
}
