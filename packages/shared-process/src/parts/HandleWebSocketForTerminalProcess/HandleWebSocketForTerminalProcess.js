import * as Command from '../Command/Command.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'

export const handleWebSocket = async (message, handle) => {
  console.log({ handle })
  // const ipc = await PtyHost.getOrCreate()
  // console.info('[sharedprocess] creating extension ipc')
  // const rpc = await ExtensionHostRpc.create(ipc, handle)
  // console.info('[sharedprocess] created extension host rpc')
  // ipc._process.send(message, handle)
  // rpc.send(message)
  // console.log('spawned extension host')
  // console.log(rpc)
}
