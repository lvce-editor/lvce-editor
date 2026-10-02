import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const simpleBrowserWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.simpleBrowserWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/simple-browser-view/dist/simpleBrowserViewWorkerMain.js`,
)
