import { accountsViewWorkerUrl } from '../AccountsViewWorkerUrl/AccountsViewWorkerUrl.ts'
import { getConfiguredWorkerUrl } from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const launchAccountsViewWorker = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name: 'Accounts View Worker',
    url: getConfiguredWorkerUrl('develop.accountsViewWorkerPath', accountsViewWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  const { port1, port2 } = GetPortTuple.getPortTuple()
  await Promise.all([
    JsonRpc.invokeAndTransfer(ipc, 'Accounts.handleMessagePort', port1),
    RendererProcess.invokeAndTransfer('HandleMessagePort.handleMessagePort', port2, 'Accounts'),
  ])
  return ipc
}
