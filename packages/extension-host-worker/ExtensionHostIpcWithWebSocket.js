/* istanbul ignore file */
import * as Callback from '../Callback/Callback.js'
import * as Command from '../Command/Command.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as IpcWithElectron from '../Ipc/IpcWithElectron.js'
import * as IpcWithWebSocket from '../Ipc/IpcWithWebSocket.js'

export const listen = () => {
  return IpcWithWebSocket.listen()
}
