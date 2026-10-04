import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const renameWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.renameWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/rename-worker/dist/renameWorkerMain.js`,
)
