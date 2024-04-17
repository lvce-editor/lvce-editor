import * as HandleIpc from '../HandleIpc/HandleIpc.js'
import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as TestWorkerUrl from '../TestWorkerUrl/TestWorkerUrl.js'

export const launchTestWorker = async () => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: TestWorkerUrl.testWorkerUrl,
    name: 'Test Worker',
  })
  HandleIpc.handleIpc(ipc)
  return ipc
}
