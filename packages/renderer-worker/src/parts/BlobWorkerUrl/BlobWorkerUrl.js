import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const blobWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.blobWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/blob-worker/dist/blobWorkerMain.js`,
)
