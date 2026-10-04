import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const settingsViewWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.settingsViewWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/settings-view/dist/settingsViewWorkerMain.js`,
)
