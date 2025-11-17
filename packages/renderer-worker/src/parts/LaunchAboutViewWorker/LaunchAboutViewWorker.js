import * as AboutViewWorkerUrl from '../AboutViewWorkerUrl/AboutViewWorkerUrl.js'
import { getConfiguredWorkerUrl } from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const launchAboutViewWorker = async () => {
  const name = 'About View Worker'
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: getConfiguredWorkerUrl('develop.aboutViewWorkerPath', AboutViewWorkerUrl.aboutViewWorkerUrl),
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
