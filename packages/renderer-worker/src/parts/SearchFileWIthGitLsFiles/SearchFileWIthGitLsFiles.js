import * as GitLsFiles from '../GitLsFiles/GitLsFiles.js'

const getFiles = (stdout) => {
  // TODO handle files that contain newline
  const lines = stdout.split('\n')
  return lines
}

const fallbackCache = Object.create(null)

const cache = Object.create(null)

const searchFileFallback = async (path, value) => {
  const SearchFileRemote = await import(
    '../SearchFileRemote/SearchFileRemote.js'
  )
  return SearchFileRemote.searchFile(path, value)
}

export const searchFile = async (path, value) => {
  if (path in fallbackCache) {
    return searchFileFallback(path, value)
  }
  const limit = 512
  const { stdout, stderr } = await GitLsFiles.gitLsFiles(path, value, limit)
  if (stdout === '') {
    fallbackCache[path] = true
    return searchFileFallback(path, value)
  }
  const files = getFiles(stdout)
  cache[path] = files
  return files
}
