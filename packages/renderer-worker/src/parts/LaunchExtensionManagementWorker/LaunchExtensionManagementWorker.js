import * as Id from '../Id/Id.js'
import * as IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug from '../IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug/IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.js'
import * as ShouldUsePreloadedWorker from '../ShouldUsePreloadedWorker/ShouldUsePreloadedWorker.ts'
import * as Transferrable from '../Transferrable/Transferrable.js'
import * as ExtensionManagementWorkerUrl from '../ExtensionManagementWorkerUrl/ExtensionManagementWorkerUrl.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

const getExtensionDevelopmentConfig = (platform) => {
  if (platform === PlatformType.Web) {
    return undefined
  }
  return SharedProcess.invoke('ExtensionManagement.getLinkedExtensionDevelopmentConfig')
}

export const launchExtensionManagementWorker = async () => {
  const name = 'Extension Management Worker'
  const platform = Platform.getPlatform()
  const developmentConfig = await getExtensionDevelopmentConfig(platform)
  const id = Id.create()
  let ipc = await IpcParent.create({
    id,
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    parentName: 'Renderer Worker',
    url: GetConfiguredWorkerUrl.getConfiguredWorkerUrl(
      'develop.extensionManagementWorkerPath',
      ExtensionManagementWorkerUrl.extensionManagementWorkerUrl,
    ),
  })
  if (ShouldUsePreloadedWorker.shouldUsePreloadedWorker('extensionManagementWorker')) {
    ipc = IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.wrap(Transferrable.acquire(id))
  }
  HandleIpc.handleIpc(ipc)
  await JsonRpc.invoke(ipc, 'Extensions.initialize', platform, developmentConfig)
  return ipc
}
