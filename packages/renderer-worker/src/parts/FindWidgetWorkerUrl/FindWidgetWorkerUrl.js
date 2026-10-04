import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const findWidgetWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.findWidgetWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/find-widget-worker/dist/findWidgetWorkerMain.js`,
)
