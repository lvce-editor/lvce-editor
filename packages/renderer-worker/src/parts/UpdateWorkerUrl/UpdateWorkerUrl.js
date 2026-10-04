import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const updateWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.updateWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/update-worker/dist/updateWorkerMain.js`,
)
