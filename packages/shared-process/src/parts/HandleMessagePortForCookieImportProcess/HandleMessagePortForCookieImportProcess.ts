import * as Assert from '../Assert/Assert.ts'
import * as CookieImportProcess from '../CookieImportProcess/CookieImportProcess.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'

export const handleMessagePortForCookieImportProcess = async (port: MessagePort): Promise<void> => {
  Assert.object(port)
  const ipc = await CookieImportProcess.getOrCreate()
  await JsonRpc.invokeAndTransfer(ipc, 'HandleElectronMessagePort.handleElectronMessagePort', port)
}
