import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const portsViewWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.portsViewPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/ports-view/dist/portsViewWorkerMain.js`,
)
