import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const activityBarWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.activityBarWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/activity-bar-worker/dist/activityBarWorkerMain.js`,
)
