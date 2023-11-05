import { VError } from '../VError/VError.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const transferMessagePortMain = async (ipc, port, ...params) => {
  try {
    await JsonRpc.invokeAndTransfer(ipc, [port], 'HandleElectronMessagePort.handleElectronMessagePort', ...params)
  } catch (error) {
    throw new VError(error, `Failed to send message port to utility process`)
  }
}
