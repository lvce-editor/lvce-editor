import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as LaunchTestWorker from '../LaunchTestWorker/LaunchTestWorker.ts'
import * as Platform from '../Platform/Platform.ts'

export const execute = async (href) => {
  const ipc = await LaunchTestWorker.launchTestWorker()
  await JsonRpc.invoke(ipc, 'Test.execute', href, Platform.platform)
}
