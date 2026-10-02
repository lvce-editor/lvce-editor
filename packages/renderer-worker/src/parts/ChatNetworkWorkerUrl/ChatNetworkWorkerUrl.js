import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const chatNetworkWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.chatNetworkWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/chat-network-worker/dist/chatNetworkWorkerMain.js`,
)
