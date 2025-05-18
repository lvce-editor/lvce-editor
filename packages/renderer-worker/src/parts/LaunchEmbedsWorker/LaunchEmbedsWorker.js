import * as EmbedsWorkerUrl from '../EmbedsWorkerUrl/EmbedsWorkerUrl.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

const getConfiguredWorkerUrl = () => {
  let configuredWorkerUrl = Preferences.get('develop.embedsWorkerPath') || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || EmbedsWorkerUrl.embedsWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = EmbedsWorkerUrl.embedsWorkerUrl
  }
  return configuredWorkerUrl
}

export const launchEmbedsWorker = async () => {
  const url = getConfiguredWorkerUrl()
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url,
    name: 'Embeds Worker',
  })
  HandleIpc.handleIpc(ipc)
  await JsonRpc.invoke(ipc, 'Initialize.initialize')
  return ipc
}
