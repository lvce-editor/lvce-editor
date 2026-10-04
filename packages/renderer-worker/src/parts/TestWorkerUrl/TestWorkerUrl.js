import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const testWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.testWorkerPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/test-worker/dist/testWorkerMain.js`,
)
