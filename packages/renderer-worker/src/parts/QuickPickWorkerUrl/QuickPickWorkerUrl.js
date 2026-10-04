import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const quickPickWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.quickPickWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/quick-pick-worker/dist/quickPickWorkerMain.js`,
)
