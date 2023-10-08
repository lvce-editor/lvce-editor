import { VError } from '@lvce-editor/verror'
import * as Exec from '../Exec/Exec.js'
import * as GetElectronRebuildPath from '../GetElectronRebuildPath/GetElectronRebuildPath.js'

/**
 * @param {string} cwd
 */
export const rebuild = async (cwd) => {
  try {
    const electronRebuildPath = GetElectronRebuildPath.getElectronRebuildPath()
    await Exec.exec(electronRebuildPath, [], {
      cwd,
      stdio: 'inherit',
    })
  } catch (error) {
    throw new VError(error, `Failed to rebuild native module`)
  }
}
