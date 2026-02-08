import * as LanguageModelsViewWorkerUrl from '../LanguageModelsViewWorkerUrl/LanguageModelsViewWorkerUrl.js'
import { getConfiguredWorkerUrl } from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const launchLanguageModelsViewWorker = async () => {
  const name = 'Language Models View Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl('develop.languageModelsViewPath', LanguageModelsViewWorkerUrl.languageModelsViewWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
