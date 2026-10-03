import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const embedsWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.embedsWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/embeds-worker/dist/embedsWorkerMain.js`,
)
