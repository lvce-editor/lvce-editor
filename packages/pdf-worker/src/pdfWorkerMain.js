import * as IpcChild from './parts/IpcChild/IpcChild.js'
import * as IpcChildType from './parts/IpcChildType/IpcChildType.js'
import * as Command from './parts/Command/Command.js'
import * as JsonRpcVersion from './parts/JsonRpcVersion/JsonRpcVersion.js'

const main = async () => {
  const ipc = await IpcChild.listen({ method: IpcChildType.Auto() })

  // disable pdfjs messages
  globalThis.postMessage = () => {}

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

main()
