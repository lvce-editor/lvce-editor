import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const debugWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.debugWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/debug-worker/dist/debugWorkerMain.js`,
)
