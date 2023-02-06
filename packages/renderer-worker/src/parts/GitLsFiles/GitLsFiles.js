import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const gitLsFiles = (gitPath, cwd, limit) => {
  return SharedProcess.invoke('GitLsFiles.gitLsFiles', gitPath, cwd, limit)
}

export const gitLsFilesHash = (gitPath, cwd, limit) => {
  return SharedProcess.invoke('GitLsFiles.gitLsFilesHash', gitPath, cwd, limit)
}

export const resolveGit = () => {
  return SharedProcess.invoke('GitLsFiles.resolveGit')
}
