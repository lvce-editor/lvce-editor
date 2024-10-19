import * as AssetDir from '../AssetDir/AssetDir.js'
import * as FileSearchWorker from '../FileSearchWorker/FileSearchWorker.js'

export const searchFile = async (path, value, prepare) => {
  return FileSearchWorker.invoke('SearchFile.searchFile', path, value, prepare, AssetDir.assetDir)
}
