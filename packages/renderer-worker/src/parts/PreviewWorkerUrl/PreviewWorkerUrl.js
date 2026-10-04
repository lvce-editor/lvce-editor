import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const previewWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.previewWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/preview-worker/dist/previewWorkerMain.js`,
)
