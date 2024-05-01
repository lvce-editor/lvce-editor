import * as GetFileSearchRipGrepArgs from '../GetFileSearchRipGrepArgs/GetFileSearchRipGrepArgs.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as SharedProcessCommandType from '../SharedProcessCommandType/SharedProcessCommandType.js'
import * as SplitLines from '../SplitLines/SplitLines.js'

export const searchFile = async (path, value) => {
  const ripGrepArgs = GetFileSearchRipGrepArgs.getFileSearchRipGrepArgs()
  const options = {
    ripGrepArgs,
    searchPath: path,
    limit: 9999999,
  }
  const stdout = await SharedProcess.invoke(SharedProcessCommandType.SearchFileSearchFile, options)
  const lines = SplitLines.splitLines(stdout)
  return lines
}
