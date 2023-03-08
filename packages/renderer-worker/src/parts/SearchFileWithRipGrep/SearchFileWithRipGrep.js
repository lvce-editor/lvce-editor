import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as SplitLines from '../SplitLines/SplitLines.js'
import * as SharedProcessCommandType from '../SharedProcessCommandType/SharedProcessCommandType.js'

export const searchFile = async (path, value) => {
  const stdout = await SharedProcess.invoke(SharedProcessCommandType.SearchSearchFile, /* path */ path, /* searchTerm */ value, /* limit */ 9999999)
  const lines = SplitLines.splitLines(stdout)
  return lines
}
