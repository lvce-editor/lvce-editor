import * as GitLsFiles from '../GitLsFiles/GitLsFiles.js'

const getFiles = (stdout) => {
  // TODO handle files that contain newline
  const lines = stdout.split('\n')
  return lines
}

export const searchFile = async (path, value) => {
  const limit = 512
  const files = await GitLsFiles.gitLsFiles(path, limit)
  return files
}
