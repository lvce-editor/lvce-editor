import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'

export const handleIpc = (ipc, source = 'process') => {
  const handleMessageFromRendererProcess = async (message) => {
    if (typeof message === 'string') {
      console.warn(`unexpected message from ${source}: ${message}`)
      return
    }
    if (message.id) {
      if ('method' in message) {
        try {
          const result = await Command.execute(message.method, ...message.params)
          ipc.send({
            jsonrpc: JsonRpcVersion.Two,
            id: message.id,
            result,
          })
          return
        } catch (error) {
          ipc.send({
            jsonrpc: JsonRpcVersion.Two,
            id: message.id,
            error,
          })
          return
        }
      }
      Callback.resolve(message.id, message)
      return
    }
    await Command.execute(message.method, ...message.params)
  }
  ipc.onmessage = handleMessageFromRendererProcess
}
