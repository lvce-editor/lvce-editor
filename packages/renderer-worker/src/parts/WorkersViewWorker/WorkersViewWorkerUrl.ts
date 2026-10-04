import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const workersViewWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.workersViewPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/workers-view/dist/workersViewMain.js`,
)
