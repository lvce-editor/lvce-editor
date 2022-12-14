import * as WorkerType from '../WorkerType/WorkerType.js'

export const create = async ({ url, name }) => {
  const worker = new Worker(url, {
    type: WorkerType.Module,
    name,
  })
  await new Promise((resolve, reject) => {
    const cleanup = () => {
      worker.onmessage = null
      worker.onerror = null
    }
    const handleFirstMessage = (event) => {
      cleanup()
      if (event.data === 'ready') {
        resolve(undefined)
      } else {
        reject(new Error('unexpected first message from renderer worker'))
      }
    }
    const handleFirstError = async (event) => {
      cleanup()
      reject(new Error('failed to start worker'))
    }
    worker.onmessage = handleFirstMessage
    worker.onerror = handleFirstError
  })
  const channel = new MessageChannel()
  const { port1, port2 } = channel
  worker.postMessage(
    {
      jsonrpc: '2.0',
      method: 'initialize',
      params: ['message-port', port1],
    },
    [port1]
  )
  return port2
}
