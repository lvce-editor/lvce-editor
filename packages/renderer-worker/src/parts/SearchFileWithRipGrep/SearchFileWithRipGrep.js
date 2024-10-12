import * as FileSearchWorker from '../FileSearchWorker/FileSearchWorker.js'

export const searchFile = async (path, value) => {
  // const ripGrepArgs = GetFileSearchRipGrepArgs.getFileSearchRipGrepArgs()
  // const options = {
  //   ripGrepArgs,
  //   searchPath: path,
  //   limit: 9999999,
  // }
  // const stdout = await SearchProcess.invoke(SharedProcessCommandType.SearchFileSearchFile, options)
  // const lines = SplitLines.splitLines(stdout)
  const lines = await FileSearchWorker.invoke('SearchFile.searchFileWithRipGrep', path, value)
  return lines
}
