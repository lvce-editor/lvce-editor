import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const authWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.authWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/auth-worker/dist/authWorkerMain.js`,
)
