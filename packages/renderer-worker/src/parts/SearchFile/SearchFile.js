import * as Platform from '../Platform/Platform.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

const searchFileWeb = (path, value) => {
  // TODO
  return []
}

const searchFileRemote = async (path, value) => {
  const files = await SharedProcess.invoke(
    /* SearchFile.searchFile */ 'SearchFile.searchFile',
    /* path */ path,
    /* searchTerm */ value
  )
  return files
}

export const searchFile = async (path, value) => {
  switch (Platform.platform) {
    case 'web':
      return searchFileWeb(path, value)
    case 'electron':
    case 'remote':
      return searchFileRemote(path, value)
    default:
      return []
  }
}
