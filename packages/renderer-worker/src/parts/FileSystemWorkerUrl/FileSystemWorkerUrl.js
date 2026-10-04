import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const fileSystemWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.fileSystemWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/file-system-worker/dist/fileSystemWorkerMain.js`,
)
