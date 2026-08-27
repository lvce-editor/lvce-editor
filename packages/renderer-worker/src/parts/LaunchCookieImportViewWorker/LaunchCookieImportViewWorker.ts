import { cookieImportViewWorkerUrl } from '../CookieImportViewWorkerUrl/CookieImportViewWorkerUrl.ts'
import { getConfiguredWorkerUrl } from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const launchCookieImportViewWorker = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name: 'Cookie Import View Worker',
    url: getConfiguredWorkerUrl('develop.cookieImportViewWorkerPath', cookieImportViewWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  const { port1, port2 } = GetPortTuple.getPortTuple()
  await Promise.all([
    JsonRpc.invokeAndTransfer(ipc, 'CookieImportView.handleMessagePort', port1),
    RendererProcess.invokeAndTransfer('HandleMessagePort.handleMessagePort', port2, 'CookieImportView'),
  ])
  return ipc
}
