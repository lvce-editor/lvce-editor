import * as IpcChild from './parts/IpcChild/IpcChild.js'
import * as IpcChildType from './parts/IpcChildType/IpcChildType.js'
import * as Rpc from './parts/Rpc/Rpc.js'

const main = async () => {
  const ipc = await IpcChild.listen({ method: IpcChildType.Auto() })
  Rpc.listen(ipc)
}

main()
