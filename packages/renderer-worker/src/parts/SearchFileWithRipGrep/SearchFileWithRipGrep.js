import * as FileSearchWorker from '../FileSearchWorker/FileSearchWorker.js'

export const searchFile = async (path, value, prepare) => {
  const lines = await FileSearchWorker.invoke('SearchFile.searchFileWithRipGrep', path, value, prepare)
  return lines
}
