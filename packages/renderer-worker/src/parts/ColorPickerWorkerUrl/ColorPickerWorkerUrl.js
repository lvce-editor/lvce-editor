import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const colorPickerWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.colorPickerWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/color-picker-worker/dist/colorPickerWorkerMain.js`,
)
