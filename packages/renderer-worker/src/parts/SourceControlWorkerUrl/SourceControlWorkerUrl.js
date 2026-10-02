import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const sourceControlWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.sourceControlWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/source-control-worker/dist/sourceControlWorkerMain.js`,
)
