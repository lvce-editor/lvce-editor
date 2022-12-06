import * as Api from './parts/Api/Api.js'
import * as IpcChild from './parts/IpcChild/IpcChild.js'
import * as IpcChildType from './parts/IpcChildType/IpcChildType.js'
import * as Rpc from './parts/Rpc/Rpc.js'

const main = async () => {
  globalThis.vscode = Api.api
  const ipc = await IpcChild.listen({ method: IpcChildType.Auto() })
  Rpc.listen(ipc)
}

main()
