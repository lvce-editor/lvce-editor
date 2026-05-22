import * as AssetDir from '../AssetDir/AssetDir.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as LaunchTestWorker from '../LaunchTestWorker/LaunchTestWorker.ts'
import * as Platform from '../Platform/Platform.js'
import * as TestWorker from '../TestWorker/TestWorker.js'

export const execute = async (href) => {
  const ipc = await LaunchTestWorker.launchTestWorker()
  await JsonRpc.invoke(ipc, 'Test.execute', href, Platform.getPlatform(), AssetDir.assetDir)
}

export const tryAutoFix = async () => {
  const ipc = TestWorker.get()
  await JsonRpc.invoke(ipc, 'Test.tryAutoFix')
}
