import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const terminalWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.terminalWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/terminal-worker/dist/terminalWorkerMain.js`,
)
