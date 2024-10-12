import * as FileSearchWorker from '../FileSearchWorker/FileSearchWorker.js'

export const searchFile = async (path, value) => {
  const lines = await FileSearchWorker.invoke('SearchFile.searchFileWithRipGrep', path, value)
  return lines
}
