import * as GetFileSearchRipGrepArgs from '../GetFileSearchRipGrepArgs/GetFileSearchRipGrepArgs.js'
import * as SearchProcess from '../SearchProcess/SearchProcess.js'
import * as SharedProcessCommandType from '../SharedProcessCommandType/SharedProcessCommandType.js'
import * as SplitLines from '../SplitLines/SplitLines.js'

export const searchFile = async (path, value) => {
  const ripGrepArgs = GetFileSearchRipGrepArgs.getFileSearchRipGrepArgs()
  const options = {
    ripGrepArgs,
    searchPath: path,
    limit: 9999999,
  }
  const stdout = await SearchProcess.invoke(SharedProcessCommandType.SearchFileSearchFile, options)
  const lines = SplitLines.splitLines(stdout)
  return lines
}
