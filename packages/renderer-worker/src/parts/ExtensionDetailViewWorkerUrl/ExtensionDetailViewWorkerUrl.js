import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const extensionDetailViewWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.extensionDetailViewWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/extension-detail-view/dist/extensionDetailViewWorkerMain.js`,
)
