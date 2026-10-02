import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const iconThemeWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.iconThemeWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/icon-theme-worker/dist/iconThemeWorkerMain.js`,
)
