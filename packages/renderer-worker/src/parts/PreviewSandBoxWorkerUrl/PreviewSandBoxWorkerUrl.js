import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const previewSandBoxWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.previewSandboxWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/preview-sandbox-worker/dist/previewSandBoxWorkerMain.js`,
)
