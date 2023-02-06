import * as FileSearchCache from '../FileSearchCache/FileSearchCache.js'
import * as FileSearchResultType from '../FileSearchResultType/FileSearchResultType.js'
import * as GitLsFiles from '../GitLsFiles/GitLsFiles.js'
import * as SplitLines from '../SplitLines/SplitLines.js'

export const state = {
  resolvedGit: '',
}

const resolveGit = async () => {
  return GitLsFiles.resolveGit()
}

const getOrResolveGit = async () => {
  if (!state.resolvedGit) {
    state.resolvedGit = await resolveGit()
  }
  return state.resolvedGit
}

export const searchFile = async (path, value) => {
  const limit = 512
  const gitPath = await getOrResolveGit()
  const result = await GitLsFiles.gitLsFilesHash(gitPath, path, limit)
  const { cacheId } = result
  const cachedResult = await FileSearchCache.get(cacheId)
  if (cachedResult) {
    return SplitLines.splitLines(cachedResult)
  }
  const actualResult = await GitLsFiles.gitLsFiles(gitPath, path, limit)
  await FileSearchCache.set(actualResult.cacheId, actualResult.stdout)
  const files = SplitLines.splitLines(actualResult.stdout)
  return files
}
