import * as ElectronProcess from '../ElectronProcess/ElectronProcess.js'
import { VError } from '../VError/VError.js'

export const open = async () => {
  try {
    await ElectronProcess.invoke('ElectronWindowProcessExplorer.open')
  } catch (error) {
    throw new VError(error, `Failed to open process explorer`)
  }
}
