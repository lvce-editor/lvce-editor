import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const chatStorageWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.chatStorageWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/chat-storage-worker/dist/chatStorageWorkerMain.js`,
)
