import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.js'
import * as RpcOut from '../RpcOut/RpcOut.js'

export const start = async ({ Command }) => {
  const ipc = await IpcChild.listen({ method: IpcChildType.Auto() })
  const handleMessage = async (data) => {
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
  ipc.on('message', handleMessage)
  RpcOut.setIpc(ipc)
}
