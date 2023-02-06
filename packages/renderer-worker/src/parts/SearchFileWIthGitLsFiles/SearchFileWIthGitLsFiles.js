import * as FileSearchCache from '../FileSearchCache/FileSearchCache.js'
import * as GitLsFiles from '../GitLsFiles/GitLsFiles.js'
import * as SplitLines from '../SplitLines/SplitLines.js'

const getStdout = async (result) => {
  const { type, stdout, cacheId } = result
  if (type === 'new') {
    await FileSearchCache.set(cacheId, stdout)
    return stdout
  }
  if (result.type === 'from-cache') {
    return FileSearchCache.get(cacheId)
  }
  throw new Error('unknown result type')
}

export const searchFile = async (path, value) => {
  console.log({ path })
  const limit = 512
  const result = await GitLsFiles.gitLsFiles(path, limit)
  const stdout = await getStdout(result)
  const files = SplitLines.splitLines(stdout)
  return files
}
