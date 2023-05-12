import * as HandleMessage from '../HandleMessage/HandleMessage.js'
import * as IpcChild from '../IpcChild/IpcChild.js'
import * as IpcChildType from '../IpcChildType/IpcChildType.js'

export const main = async () => {
  const ipc = await IpcChild.listen({ method: IpcChildType.Auto() })
  ipc.on('message', HandleMessage.handleMessage)
}

main()
