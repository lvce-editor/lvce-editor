import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const searchFile = async (path, value) => {
  const stdout = await SharedProcess.invoke(
    /* SearchFile.searchFile */ 'SearchFile.searchFile',
    /* path */ path,
    /* searchTerm */ value
  )
  const lines = stdout.split('\n')
  return lines
}
