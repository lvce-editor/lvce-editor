import * as Id from '../Id/Id.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as RendererProcessIpcParentType from '../RendererProcessIpcParentType/RendererProcessIpcParentType.js'

export const launchIsolatedExtensionHostWorker = async (port, extensionId, url) => {
  const suffix = extensionId ? `: ${extensionId}` : ''
  const name = Platform.getPlatform() === PlatformType.Electron ? `Extension API (Electron)${suffix}` : `Extension API${suffix}`
  const id = Id.create()
  await RendererProcess.invokeAndTransfer('IpcParent.create', {
    method: RendererProcessIpcParentType.ModuleWorkerWithMessagePort,
    name,
    port,
    raw: true,
    url,
    id,
  })
}
