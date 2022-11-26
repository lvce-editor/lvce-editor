import * as Exec from '../Exec/Exec.js'

export const gitLsFiles = async (cwd, limit) => {
  const { stdout, stderr } = await Exec.exec('git', ['ls-files'], {
    cwd,
  })
  // TODO limit stdout lines to given limit
  return stdout
}
