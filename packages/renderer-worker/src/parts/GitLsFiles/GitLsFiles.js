import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const gitLsFiles = (cwd, limit) => {
  return SharedProcess.invoke('GitLsFiles.gitLsFiles', cwd, limit)
}
