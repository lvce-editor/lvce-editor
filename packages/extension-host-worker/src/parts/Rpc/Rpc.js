import * as Callback from '../Callback/Callback.js'
import * as GetResponse from '../GetResponse/GetResponse.js'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'

export const state = {
  /**
   * @type {any}
   */
  ipc: undefined,
}

export const send = (method, ...params) => {
  const { ipc } = state
  ipc.send({
    jsonrpc: '2.0',
    method,
    params,
  })
}

export const listen = (ipc) => {
  const handleMessage = async (event) => {
    const message = event.data
    if ('method' in message) {
      const response = await GetResponse.getResponse(message)
      try {
        ipc.send(response)
      } catch (error) {
        await ErrorHandling.logError(error)
        const errorResponse = GetResponse.getErrorResponse(message, error)
        ipc.send(errorResponse)
      }
    } else if ('result' in message) {
      Callback.resolve(message.id, message.result)
    } else if ('error' in message) {
      Callback.reject(message.id, message.error)
    } else {
      console.log({ message })
    }
  }
  ipc.onmessage = handleMessage
  state.ipc = ipc
}
