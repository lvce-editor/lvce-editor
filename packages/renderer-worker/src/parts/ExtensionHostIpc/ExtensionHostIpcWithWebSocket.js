/* istanbul ignore file */
import * as IpcWithWebSocket from '../Ipc/IpcWithWebSocket.js'

export const listen = () => {
  return IpcWithWebSocket.listen({
    protocol: 'lvce.extension-host',
  })
}
