import * as AssetDir from '../AssetDir/AssetDir.js'
import * as JsonRpc from '../JsonRpc/JsonRpc.js'
import * as LaunchTestWorker from '../LaunchTestWorker/LaunchTestWorker.ts'
import * as Platform from '../Platform/Platform.js'

export const execute = async (href) => {
  const ipc = await LaunchTestWorker.launchTestWorker()
  await JsonRpc.invoke(ipc, 'Test.execute', href, Platform.platform, AssetDir.assetDir)
}
