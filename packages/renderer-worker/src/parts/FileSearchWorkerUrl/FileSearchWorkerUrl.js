import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const fileSearchWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.fileSearchWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/file-search-worker/dist/fileSearchWorkerMain.js`,
)
