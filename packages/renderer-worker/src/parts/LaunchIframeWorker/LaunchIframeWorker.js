import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as Id from '../Id/Id.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as IframeWorkerUrl from '../IframeWorkerUrl/IframeWorkerUrl.js'

const getConfiguredWorkerUrl = () => {
  let configuredWorkerUrl = Preferences.get('develop.iframeWorkerPath') || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || IframeWorkerUrl.iframeWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = IframeWorkerUrl.iframeWorkerUrl
  }
  return configuredWorkerUrl
}

export const launchIframeWorker = async () => {
  const configuredWorkerUrl = getConfiguredWorkerUrl()
  const name = 'Iframe Worker'
  const id = Id.create()
  let ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: configuredWorkerUrl,
    id,
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
