import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const textMeasurementWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.textMeasurementWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/text-measurement-worker/dist/textMeasurementWorkerMain.js`,
)
