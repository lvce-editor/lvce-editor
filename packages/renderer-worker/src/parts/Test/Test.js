import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as LaunchTestWorker from '../LaunchTestWorker/LaunchTestWorker.js'

export const execute = async (href) => {
  const ipc = LaunchTestWorker.launchTestWorker()
  await JsonRpc.invoke(ipc, 'Test.execute', href)
}
