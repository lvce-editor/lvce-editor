import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const extensionManagementWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.extensionManagementWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/extension-management-worker/dist/extensionManagementWorkerMain.js`,
)
