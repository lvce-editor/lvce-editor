import { getConfiguredWorkerUrl } from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import { handleSecretsViewMessagePort } from '../HandleSecretsViewMessagePort/HandleSecretsViewMessagePort.ts'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Platform from '../Platform/Platform.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import { secretsViewWorkerUrl } from '../SecretsViewWorkerUrl/SecretsViewWorkerUrl.ts'

export const launchSecretsViewWorker = async (): Promise<any> => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name: 'Secrets View Worker',
    url: getConfiguredWorkerUrl('develop.secretsViewPath', secretsViewWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  await JsonRpc.invoke(ipc, 'SecretsView.initialize', Platform.getPlatform())
  const { port1: bridgeWorkerPort, port2: bridgeHostPort } = GetPortTuple.getPortTuple()
  const { port1: directWorkerPort, port2: directHostPort } = GetPortTuple.getPortTuple()
  await Promise.all([
    JsonRpc.invokeAndTransfer(ipc, 'SecretsView.handleMessagePort', bridgeWorkerPort),
    handleSecretsViewMessagePort(bridgeHostPort),
    JsonRpc.invokeAndTransfer(ipc, 'SecretsView.handleMessagePort', directWorkerPort, false),
    RendererProcess.invokeAndTransfer('HandleMessagePort.handleMessagePort', directHostPort, 'SecretsView'),
  ])
  return ipc
}
