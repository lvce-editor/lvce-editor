import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const mainAreaWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.mainAreaWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/main-area-worker/dist/mainAreaWorkerMain.js`,
)
