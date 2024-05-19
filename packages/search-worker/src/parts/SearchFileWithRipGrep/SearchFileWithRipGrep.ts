import * as GetFileSearchRipGrepArgs from '../GetFileSearchRipGrepArgs/GetFileSearchRipGrepArgs.ts'
import * as SearchProcess from '../SearchProcess/SearchProcess.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'

export const searchFile = async (path, value) => {
  const ripGrepArgs = GetFileSearchRipGrepArgs.getFileSearchRipGrepArgs()
  const options = {
    ripGrepArgs,
    searchPath: path,
    limit: 9999999,
  }
  const stdout = await SearchProcess.invoke('SearchFile.searchFile', options)
  const lines = SplitLines.splitLines(stdout)
  return lines
}
