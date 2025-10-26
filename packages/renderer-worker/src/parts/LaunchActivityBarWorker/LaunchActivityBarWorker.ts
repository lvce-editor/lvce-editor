import * as ActivityBarWorkerUrl from '../ActivityBarWorkerUrl/ActivityBarWorkerUrl.js'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'

export const launchActivityBarWorker = async () => {
  const configuredWorkerUrl = GetConfiguredWorkerUrl.getConfiguredWorkerUrl(
    'develop.activityBarWorkerPath',
    ActivityBarWorkerUrl.activityBarWorkerUrl,
  )
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: configuredWorkerUrl,
    name: 'Activity Bar Worker',
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
