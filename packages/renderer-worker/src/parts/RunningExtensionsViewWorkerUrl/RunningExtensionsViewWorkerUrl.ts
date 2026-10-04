import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const runningExtensionsViewWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.runningExtensionsViewPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/running-extensions-view/dist/runningExtensionsViewMain.js`,
)
