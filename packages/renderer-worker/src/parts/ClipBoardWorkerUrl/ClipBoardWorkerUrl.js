import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const clipBoardWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.clipBoardWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/clipboard-worker/dist/clipBoardWorkerMain.js`,
)
