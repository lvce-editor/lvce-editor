import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'

export const start = async ({ Command }) => {
  const ipc = await IpcChild.listen({ method: IpcChildType.Auto() })
  const handleMessage = async (event) => {
    const { data } = event
    const { method, params } = data
    const result = await Command.execute(method, ...params)
    if ('id' in data) {
      ipc.send({
        jsonrpc: JsonRpcVersion.Two,
        id: data.id,
        result,
      })
    } else {
      console.log({ data })
    }
  }
  ipc.onmessage = handleMessage
}
