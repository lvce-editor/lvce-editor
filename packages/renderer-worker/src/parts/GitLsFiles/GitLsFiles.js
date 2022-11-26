import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const gitLsFiles = (cwd, value, limit) => {
  return SharedProcess.invoke('GitLsFiles.gitLsFiles', cwd, value, limit)
}
