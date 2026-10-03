import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const settingsWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.settingsWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/settings-worker/dist/settingsWorkerMain.js`,
)
