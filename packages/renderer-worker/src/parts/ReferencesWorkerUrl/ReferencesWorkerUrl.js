import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const referencesWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.referencesWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/references-view/dist/referencesViewWorkerMain.js`,
)
