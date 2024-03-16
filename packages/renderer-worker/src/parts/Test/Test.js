import * as IpcParent from '../IpcParent/IpcParent.js'
import * as IpcParentType from '../IpcParentType/IpcParentType.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as TestWorkerUrl from '../TestWorkerUrl/TestWorkerUrl.js'

export const execute = async (href) => {
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: TestWorkerUrl.testWorkerUrl,
    name: 'Test Worker',
  })
  await JsonRpc.invoke(ipc, 'Test.execute', href)
}
