import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const componentStateWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.componentStateWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/component-state-worker/dist/componentStateWorkerMain.js`,
)
