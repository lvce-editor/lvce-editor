import * as ExtensionHostHelperProcessIpc from '../ExtensionHostHelperProcessIpc/ExtensionHostHelperProcessIpc.js'

export const handleWebSocket = async (message, handle) => {
  const ipc = await ExtensionHostHelperProcessIpc.create()
  ipc._process.send(message, handle)
}
