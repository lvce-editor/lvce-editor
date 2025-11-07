import * as ParentIpc from '../MainProcess/MainProcess.js'
import * as Platform from '../Platform/Platform.js'

export const handleWindowAllClosed = async () => {
  if (!Platform.isMacOs) {
    await ParentIpc.invoke('Exit.exit')
  }
}
