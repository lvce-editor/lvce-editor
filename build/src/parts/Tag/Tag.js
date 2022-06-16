import * as Exec from '../Exec/Exec.js'

export const getGitTag = async () => {
  try {
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
