import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const taskWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.taskWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/task-worker/dist/taskWorkerMain.js`,
)
