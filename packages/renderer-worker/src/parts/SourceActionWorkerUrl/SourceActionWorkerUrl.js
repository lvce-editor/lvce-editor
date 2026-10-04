import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const sourceActionWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.sourceActionWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/source-action-worker/dist/sourceActionWorkerMain.js`,
)
