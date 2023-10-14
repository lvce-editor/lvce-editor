import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import { VError } from '../VError/VError.js'

export const open = async () => {
  try {
    await SharedProcess.invoke('ElectronWindowAbout.open')
  } catch (error) {
    throw new VError(error, `Failed to open about window`)
  }
}
