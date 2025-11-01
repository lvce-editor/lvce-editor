import * as ExtensionSearchViewWorkerUrl from '../ExtensionSearchViewWorkerUrl/ExtensionSearchViewWorkerUrl.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as Platform from '../Platform/Platform.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as Preferences from '../Preferences/Preferences.js'

const getConfiguredWorkerUrl = () => {
  let configuredWorkerUrl = Preferences.get('develop.extensionSearchViewWorkerPath') || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || ExtensionSearchViewWorkerUrl.extensionSearchViewWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = ExtensionSearchViewWorkerUrl.extensionSearchViewWorkerUrl
  }
  return configuredWorkerUrl
}

export const launchExtensionSearchViewWorker = async () => {
  const name = Platform.platform === PlatformType.Electron ? 'Extension Search View Worker (Electron)' : 'Extension Search View Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl(),
  })
  HandleIpc.handleIpc(ipc)
  try {
    await JsonRpc.invoke(ipc, 'SearchExtensions.initialize')
  } catch {
    // ignore
  }
  return ipc
}
