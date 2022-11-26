import * as GitLsFiles from '../GitLsFiles/GitLsFiles.js'
import * as SplitLines from '../SplitLines/SplitLines.js'

export const searchFile = async (path, value) => {
  const limit = 512
  const stdout = await GitLsFiles.gitLsFiles(path, limit)
  const files = SplitLines.splitLines(stdout)
  return files
}
