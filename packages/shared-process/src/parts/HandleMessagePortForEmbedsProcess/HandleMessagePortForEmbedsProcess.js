import * as Assert from '../Assert/Assert.js'
import * as EmbedsProcess from '../EmbedsProcess/EmbedsProcess.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

export const handleMessagePortForEmbedsProcess = async (port) => {
  Assert.object(port)
  // TODO send port to embeds process
  const embedsProcess = await EmbedsProcess.getOrCreate()
  await JsonRpc.invokeAndTransfer(embedsProcess, [port], 'HandleElectronMessagePort.handleElectronMessagePort')
}
