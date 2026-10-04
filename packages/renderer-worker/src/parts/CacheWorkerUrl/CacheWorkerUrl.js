import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const cacheWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.cacheWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/cache-worker/cacheWorkerMain.js`,
)
