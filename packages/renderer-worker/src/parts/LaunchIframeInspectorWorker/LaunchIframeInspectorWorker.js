import * as IframeInspectorWorkerUrl from '../IframeInspectorWorkerUrl/IframeInspectorWorkerUrl.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as Preferences from '../Preferences/Preferences.js'

const getConfiguredWorkerUrl = () => {
  let configuredWorkerUrl = Preferences.get('develop.iframeInspectorWorkerPath') || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || IframeInspectorWorkerUrl.iframeInspectorWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = IframeInspectorWorkerUrl.iframeInspectorWorkerUrl
  }
  return configuredWorkerUrl
}

export const launchIframeInspectorWorker = async () => {
  const name = 'Iframe Inspector Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl(),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
