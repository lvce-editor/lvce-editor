import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const errorWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.errorWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/error-worker/dist/errorWorkerMain.js`,
)
