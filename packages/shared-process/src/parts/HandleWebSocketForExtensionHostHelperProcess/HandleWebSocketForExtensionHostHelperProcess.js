import * as ExtensionHostHelperProcessIpc from '../ExtensionHostHelperProcessIpc/ExtensionHostHelperProcessIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as Platform from '../Platform/Platform.js'

export const handleWebSocket = async (message, handle) => {
  const ipc = await IpcParent.create({
    method: IpcParentType.NodeForkedProcessWithWebSocket,
    message,
    handle,
  })
  ExtensionHostHelperProcessIpc.create()
  ipc._process.send(message, handle)
}
