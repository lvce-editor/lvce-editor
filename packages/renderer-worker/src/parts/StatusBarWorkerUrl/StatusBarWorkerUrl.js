import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const statusBarWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.statusBarWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/status-bar-worker/dist/statusBarWorkerMain.js`,
)
