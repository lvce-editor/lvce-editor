import * as Exec from '../Exec/Exec.js'

const getFiles = (stdout, limit) => {
  const lines = stdout.split('\n')
  return lines.slice(0, limit)
}

export const gitLsFiles = async (cwd, limit) => {
  const { stdout, stderr } = await Exec.exec('git', ['ls-files'], {
    cwd,
  })
  const files = getFiles(stdout, limit)
  return files
}
