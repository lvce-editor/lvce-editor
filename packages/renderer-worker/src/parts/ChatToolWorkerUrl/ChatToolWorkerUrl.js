import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const chatToolWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.chatToolWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/chat-tool-worker/dist/chatToolWorkerMain.js`,
)
