import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as IsProduction from '../IsProduction/IsProduction.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as TextSearchWorkerUrl from '../TextSearchWorkerUrl/TextSearchWorkerUrl.js'
import * as Platform from '../Platform/Platform.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'

const getConfiguredWorkerUrl = () => {
  let configuredWorkerUrl = Preferences.get('develop.textSearchWorkerPath') || ''
  if (configuredWorkerUrl) {
    configuredWorkerUrl = '/remote' + configuredWorkerUrl
  }
  configuredWorkerUrl = configuredWorkerUrl || TextSearchWorkerUrl.textSearchWorkerUrl
  if (IsProduction.isProduction) {
    configuredWorkerUrl = TextSearchWorkerUrl.textSearchWorkerUrl
  }
  return configuredWorkerUrl
}

export const launchTextSearchWorker = async () => {
  const name = 'Text Search Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl(),
  })
  HandleIpc.handleIpc(ipc)
  try {
    await JsonRpc.invoke(ipc, 'TextSearch.initialize', Platform.platform)
  } catch (error) {
    // ignore
  }
  return ipc
}
