import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcChildModule from '../IpcChildModule/IpcChildModule.ts'
import * as IpcChildType from '../IpcChildType/IpcChildType.ts'

export const handleMessagePort = (port: MessagePort) => {
  const module = IpcChildModule.getModule(IpcChildType.MessagePort)
  const ipc = module.wrap(port)
  HandleIpc.handleIpc(ipc)
  ipc.send('ready')
}
