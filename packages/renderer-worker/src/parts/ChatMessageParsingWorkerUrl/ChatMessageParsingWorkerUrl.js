import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const chatMessageParsingWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.chatMessageParsingWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/chat-message-parsing-worker/dist/chatMessageParsingWorkerMain.js`,
)
