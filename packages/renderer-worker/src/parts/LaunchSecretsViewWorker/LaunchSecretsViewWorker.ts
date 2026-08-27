import { getConfiguredWorkerUrl } from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import { handleSecretsViewMessagePort } from '../HandleSecretsViewMessagePort/HandleSecretsViewMessagePort.ts'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import { secretsViewWorkerUrl } from '../SecretsViewWorkerUrl/SecretsViewWorkerUrl.ts'

export const launchSecretsViewWorker = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name: 'Secrets View Worker',
    url: getConfiguredWorkerUrl('develop.secretsViewPath', secretsViewWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  const { port1, port2 } = GetPortTuple.getPortTuple()
  await Promise.all([JsonRpc.invokeAndTransfer(ipc, 'SecretsView.handleMessagePort', port1), handleSecretsViewMessagePort(port2)])
  return ipc
}
