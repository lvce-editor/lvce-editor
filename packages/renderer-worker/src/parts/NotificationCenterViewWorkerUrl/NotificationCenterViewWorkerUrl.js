import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const notificationCenterViewWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.notificationCenterViewWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/notification-center-view/dist/notificationCenterWorkerMain.js`,
)
