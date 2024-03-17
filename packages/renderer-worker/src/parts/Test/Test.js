import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as TestWorkerUrl from '../TestWorkerUrl/TestWorkerUrl.js'
import * as HandleIpc from '../HandleIpc/HandleIpc.js'

export const execute = async (href) => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: TestWorkerUrl.testWorkerUrl,
    name: 'Test Worker',
  })
  HandleIpc.handleIpc(ipc, 'test-worker')
  await JsonRpc.invoke(ipc, 'Test.execute', href)
}
