import * as AssetDir from '../AssetDir/AssetDir.js'
import * as QuickPickWorker from '../QuickPickWorker/QuickPickWorker.js'

export const searchFile = async (path, value, prepare) => {
  return QuickPickWorker.invoke('SearchFile.searchFile', path, value, prepare, AssetDir.assetDir)
}
