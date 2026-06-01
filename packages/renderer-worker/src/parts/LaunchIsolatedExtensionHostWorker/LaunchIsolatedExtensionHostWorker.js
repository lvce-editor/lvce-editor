import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as Id from '../Id/Id.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'

export const launchIsolatedExtensionHostWorker = async (port, extensionId, url) => {
  const suffix = extensionId ? `: ${extensionId}` : ''
  const name = Platform.getPlatform() === PlatformType.Electron ? `Extension API (Electron)${suffix}` : `Extension API${suffix}`
  const id = Id.create()
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url,
    id,
  })
  HandleIpc.handleIpc(ipc)
  await JsonRpc.invokeAndTransfer(ipc, 'HandleMessagePort.handleExtensionManagementMessagePort', port)
}
