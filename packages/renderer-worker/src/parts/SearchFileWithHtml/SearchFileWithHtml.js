import * as FileSearchWorker from '../FileSearchWorker/FileSearchWorker.js'

export const searchFile = async (uri) => {
  const files = await FileSearchWorker.invoke('SearchFile.searchFileWithHtml', uri)
  return files
}
