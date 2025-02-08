import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as MarkdownWorkerUrl from '../MarkdownWorkerUrl/MarkdownWorkerUrl.js'
import * as Preferences from '../Preferences/Preferences.js'

const getConfiguredWorkerUrl = () => {
  let configuredWorkerUrl = Preferences.get('develop.markdownWorkerPath') || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || MarkdownWorkerUrl.markdownWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = MarkdownWorkerUrl.markdownWorkerUrl
  }
  return configuredWorkerUrl
}

export const launchMarkdownWorker = async () => {
  const name = 'Markdown Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl(),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
