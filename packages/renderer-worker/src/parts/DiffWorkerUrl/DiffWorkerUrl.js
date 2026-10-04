import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const diffWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.diffWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/diff-worker/dist/diffWorkerMain.js`,
)
