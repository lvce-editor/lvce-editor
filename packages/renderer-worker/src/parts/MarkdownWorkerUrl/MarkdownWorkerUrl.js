import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const markdownWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.markdownWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/markdown-worker/dist/markdownWorkerMain.js`,
)
