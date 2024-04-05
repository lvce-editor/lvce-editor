import * as Exec from '../Exec/Exec.js'
import * as Assert from '../Assert/Assert.js'

export const getCommitDate = async (commit) => {
  Assert.string(commit)
  const { stdout } = await Exec.exec('git', ['show', '-s', '--format=%ct', commit])
  const value = parseInt(stdout)
  if (isNaN(value)) {
    throw new Error(`Failed to parse date`)
  }
  const milliseconds = value * 1000
  const date = new Date(milliseconds)
  const isoString = date.toISOString()
  return isoString
}
