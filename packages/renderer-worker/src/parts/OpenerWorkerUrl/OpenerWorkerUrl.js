import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const openerWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.openerWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/opener-worker/dist/openerWorkerMain.js`,
)
