import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const explorerWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.explorerWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/explorer-view/dist/explorerViewWorkerMain.js`,
)
