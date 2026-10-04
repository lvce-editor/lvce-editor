import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const menuWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.menuWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/menu-worker/dist/menuWorkerMain.js`,
)
