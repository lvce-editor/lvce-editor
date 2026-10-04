import * as AssetDir from '../AssetDir/AssetDir.js'
import * as GetRuntimeWorkerUrl from '../GetRuntimeWorkerUrl/GetRuntimeWorkerUrl.ts'

export const languageModelsViewWorkerUrl = GetRuntimeWorkerUrl.getRuntimeWorkerUrl(
  'develop.languageModelsViewPath',
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/language-models-view/dist/languageModelsViewMain.js`,
)
