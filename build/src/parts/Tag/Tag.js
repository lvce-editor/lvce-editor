import * as Exec from '../Exec/Exec.js'

export const getGitTag = async () => {
  try {
    if (process.env.RG_VERSION) {
      if (process.env.RG_VERSION.startsWith('v')) {
        return process.env.RG_VERSION.slice(1)
      }
      return process.env.RG_VERSION
    }
    if (process.env.GIT_TAG) {
      if (process.env.GIT_TAG.startsWith('v')) {
        return process.env.GIT_TAG.slice(1)
      }
      return process.env.GIT_TAG
    }
    const { stdout } = await Exec.exec('git', [
      'describe',
      '--exact-match',
      '--tags',
    ])
    if (stdout.startsWith('v')) {
      return stdout.slice(1)
    }
    return stdout
  } catch {}
  return '0.0.0-dev'
}
