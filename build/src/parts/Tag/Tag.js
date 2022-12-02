import * as Exec from '../Exec/Exec.js'

const getGitTagFromGitFallback = async () => {
  const { stdout, stderr, exitCode } = await Exec.exec(
    'git',
    ['describe', '--tags'],
    {
      reject: false,
    }
  )
  if (exitCode) {
    if (
      exitCode === 128 &&
      stderr.startsWith('fatal: no tag exactly matches')
    ) {
      return '0.0.0-dev'
    }
    return '0.0.0-dev'
  }
  if (stdout.startsWith('v')) {
    return stdout.slice(1)
  }
  return stdout
}

const getGitTagFromGit = async () => {
  const { stdout, stderr, exitCode } = await Exec.exec(
    'git',
    ['describe', '--exact-match', '--tags'],
    {
      reject: false,
    }
  )
  if (exitCode) {
    if (
      exitCode === 128 &&
      stderr.startsWith('fatal: no tag exactly matches')
    ) {
      return getGitTagFromGitFallback()
    }
    return '0.0.0-dev'
  }
  if (stdout.startsWith('v')) {
    return stdout.slice(1)
  }
  return stdout
}

export const getGitTag = async () => {
  const { env } = process
  const { RG_VERSION, GIT_TAG } = env
  if (RG_VERSION) {
    if (RG_VERSION.startsWith('v')) {
      return RG_VERSION.slice(1)
    }
    return RG_VERSION
  }
  if (GIT_TAG) {
    if (GIT_TAG.startsWith('v')) {
      return GIT_TAG.slice(1)
    }
    return GIT_TAG
  }
  return getGitTagFromGit()
}
