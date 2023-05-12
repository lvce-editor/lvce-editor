import * as Command from '../Command/Command.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as PtyHost from '../PtyHost/PtyHost.js'

export const handleWebSocket = async (message, handle) => {
  const instance = await PtyHost.getOrCreate()
  instance.sendAndTransfer({ jsonrpc: '2.0', method: 'handleWebSocket', params: [] }, handle)
  console.log({ instance })
  // const ipc = await PtyHost.getOrCreate()
  // console.info('[sharedprocess] creating extension ipc')
  // const rpc = await ExtensionHostRpc.create(ipc, handle)
  // console.info('[sharedprocess] created extension host rpc')
  // ipc._process.send(message, handle)
  // rpc.send(message)
  // console.log('spawned extension host')
  // console.log(rpc)
}
