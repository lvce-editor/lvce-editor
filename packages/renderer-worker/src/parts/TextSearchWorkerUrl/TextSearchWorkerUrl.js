import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const textSearchWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.textSearchWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/text-search-worker/dist/textSearchWorkerMain.js`,
)
