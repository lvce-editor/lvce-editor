import * as ExtensionHostIpc from '../ExtensionHostIpc/ExtensionHostIpc.js'
import * as ExtensionHostRpc from '../ExtensionHostRpc/ExtensionHostRpc.js'

// TODO lazyload modules for spawning extension host, they are only needed later
export const handleWebSocket = async (message, handle) => {
  // console.log('[shared-process] received extension host websocket', message)
  const ipc = await ExtensionHostIpc.create()
  console.info('[sharedprocess] creating extension ipc')
  const rpc = await ExtensionHostRpc.create(ipc, handle)
  console.info('[sharedprocess] created extension host rpc')
  ipc._process.send(message, handle)
  // rpc.send(message)
  // console.log('spawned extension host')
  // console.log(rpc)
}
