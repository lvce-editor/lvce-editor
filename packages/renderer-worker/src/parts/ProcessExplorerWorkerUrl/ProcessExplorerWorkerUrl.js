import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const processExplorerWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.processExplorerWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/process-explorer-worker/index.js`,
)
