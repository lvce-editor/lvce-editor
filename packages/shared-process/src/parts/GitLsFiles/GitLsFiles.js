import * as Exec from '../Exec/Exec.js'

export const gitLsFiles = async (cwd, value, limit) => {
  const { stdout, stderr, exitCode } = await Exec.exec(
    'git',
    ['ls-files', `${value}`],
    {
      cwd,
    }
  )
  return {
    stdout,
    stderr,
    exitCode,
  }
}
