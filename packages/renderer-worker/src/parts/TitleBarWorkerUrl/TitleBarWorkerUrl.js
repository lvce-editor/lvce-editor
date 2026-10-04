import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const titleBarWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.titleBarWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/title-bar-worker/dist/titleBarWorkerMain.js`,
)
