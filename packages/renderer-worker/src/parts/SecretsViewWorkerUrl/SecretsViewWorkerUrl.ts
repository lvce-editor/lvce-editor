import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const secretsViewWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.secretsViewPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/secrets-view/dist/secretsViewWorkerMain.js`,
)
