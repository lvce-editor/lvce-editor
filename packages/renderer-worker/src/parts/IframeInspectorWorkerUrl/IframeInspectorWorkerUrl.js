import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const iframeInspectorWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.iframeInspectorWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/iframe-inspector/dist/iframeInspectorWorkerMain.js`,
)
