import * as Exec from '../Exec/Exec.js'
import VError from 'verror'

export const getCommitHash = async () => {
  try {
    const { stdout } = await Exec.exec('git', [
      'rev-parse',
      '--short=7',
      'HEAD',
    ])
    return stdout
  } catch (error) {
    // @ts-ignore
    throw new VError(error, 'Failed to get commit hash')
  }
}

export const getCommitMessage = async () => {
  try {
    const { stdout } = await Exec.exec('git', ['log', '-1', '--pretty=%B'])
    return stdout.trim()
  } catch (error) {
    // @ts-ignore
    throw new VError(error, 'Failed to get commit message')
  }
}
