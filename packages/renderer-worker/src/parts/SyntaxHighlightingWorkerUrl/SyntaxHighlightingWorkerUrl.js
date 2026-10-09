import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const syntaxHighlightingWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.syntaxHighlightingWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/syntax-highlighting-worker/dist/syntaxHighlightingWorkerMain.js`,
)
