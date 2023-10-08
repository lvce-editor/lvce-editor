import { VError } from '@lvce-editor/verror'
import * as Exec from '../Exec/Exec.js'

/**
 * @param {string} cwd
 */
export const rebuild = async (cwd) => {
  try {
    await Exec.exec('npm', ['rebuild'], {
      cwd,
      stdio: 'inherit',
    })
  } catch (error) {
    throw new VError(error, `Failed to rebuild native module`)
  }
}
