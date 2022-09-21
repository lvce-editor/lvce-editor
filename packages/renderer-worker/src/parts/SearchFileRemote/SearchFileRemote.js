import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const searchFile = async (path, value) => {
  const files = await SharedProcess.invoke(
    /* SearchFile.searchFile */ 'SearchFile.searchFile',
    /* path */ path,
    /* searchTerm */ value
  )
  return files
}
