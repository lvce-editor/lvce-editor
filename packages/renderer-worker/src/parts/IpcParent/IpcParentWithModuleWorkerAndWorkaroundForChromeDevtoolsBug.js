import * as WorkerType from '../WorkerType/WorkerType.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const create = async ({ url, name }) => {
  try {
    const originalOnMessage = RendererProcess.state.ipc.onmessage
    const port = await new Promise((resolve, reject) => {
      RendererProcess.state.ipc.onmessage = (event) => {
        if (event.data === 'port') {
          const port = event.ports[0]
          resolve(port)
        } else {
          originalOnMessage(event)
        }
      }
      RendererProcess.send({
        jsonrpc: '2.0',
        method: 'get-port',
        params: [
          'worker',
          { method: /* ModuleWorkerWithMessagePort */ 4, url, name },
        ],
      })
    })
    let handleMessage
    return {
      get onmessage() {
        return port.onmessage
      },
      set onmessage(listener) {
        if (listener) {
          handleMessage = (event) => {
            // TODO why are some events not instance of message event?
            if (event instanceof MessageEvent) {
              const message = event.data
              listener(message)
            } else {
              listener(event)
            }
          }
        } else {
          handleMessage = null
        }
        port.onmessage = handleMessage
      },
      send(message) {
        port.postMessage(message)
      },
      sendAndTransfer(message, transfer) {
        port.postMessage(message, transfer)
      },
    }
  } catch (error) {
    throw error
  }
}
