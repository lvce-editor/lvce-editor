import * as GitLsFiles from './GitLsFiles.ts'

export const name = 'GitLsFiles'

export const Commands = {
  gitLsFiles: GitLsFiles.gitLsFiles,
  gitLsFilesHash: GitLsFiles.gitLsFilesHash,
  resolveGit: GitLsFiles.resolveGit,
}
