import * as PtyHost from '../PtyHost/PtyHost.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const handleMessagePortForTerminalProcess = async (port) => {
  const ptyHost = await PtyHost.getOrCreate()
  await JsonRpc.invokeAndTransfer(ptyHost, port, 'HandleElectronMessagePort.handleElectronMessagePort')
}
