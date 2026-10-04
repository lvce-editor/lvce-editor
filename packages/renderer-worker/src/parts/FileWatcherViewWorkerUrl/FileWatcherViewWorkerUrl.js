import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const fileWatcherViewWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.fileWatcherViewPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/file-watcher-view/index.js`,
)
