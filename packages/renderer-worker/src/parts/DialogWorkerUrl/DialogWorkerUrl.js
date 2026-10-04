import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const dialogWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.dialogWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/dialog-worker/dist/dialogWorkerMain.js`,
)
