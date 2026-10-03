import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const textSearchViewWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.textSearchViewPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/text-search-view/dist/textSearchViewMain.js`,
)
