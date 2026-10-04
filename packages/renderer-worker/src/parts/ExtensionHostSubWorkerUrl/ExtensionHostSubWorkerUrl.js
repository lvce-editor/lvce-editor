import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const extensionHostSubWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.extensionHostSubWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/extension-host-sub-worker/dist/extensionHostSubWorkerMain.js`,
)
