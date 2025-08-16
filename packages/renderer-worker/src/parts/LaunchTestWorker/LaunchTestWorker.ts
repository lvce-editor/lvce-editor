import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as TestWorker from '../TestWorker/TestWorker.js'
import * as TestWorkerUrl from '../TestWorkerUrl/TestWorkerUrl.js'

export const launchTestWorker = async () => {
  const configuredWorkerUrl = GetConfiguredWorkerUrl.getConfiguredWorkerUrl('develop.testWorkerPath', TestWorkerUrl.testWorkerUrl)
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: configuredWorkerUrl,
    name: 'Test Worker',
  })
  HandleIpc.handleIpc(ipc)
  TestWorker.set(ipc)
  return ipc
}
