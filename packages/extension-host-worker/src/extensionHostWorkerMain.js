import * as Api from './parts/Api/Api.js'
import * as IpcChild from './parts/IpcChild/IpcChild.js'
import * as Rpc from './parts/Rpc/Rpc.js'

const main = async () => {
  console.log('start worker')
  globalThis.vscode = Api.create()
  const ipc = await IpcChild.listen({ method: IpcChild.Methods.Auto })
  Rpc.listen(ipc)
}

main()
