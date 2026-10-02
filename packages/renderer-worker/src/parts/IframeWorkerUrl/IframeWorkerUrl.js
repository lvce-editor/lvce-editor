import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const iframeWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.iframeWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/iframe-worker/dist/iframeWorkerMain.js`,
)
