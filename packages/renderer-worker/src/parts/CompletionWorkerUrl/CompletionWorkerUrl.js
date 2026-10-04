import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const completionWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.completionWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/completion-worker/dist/completionWorkerMain.js`,
)
