import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const panelWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.panelWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/panel-worker/dist/panelWorkerMain.js`,
)
