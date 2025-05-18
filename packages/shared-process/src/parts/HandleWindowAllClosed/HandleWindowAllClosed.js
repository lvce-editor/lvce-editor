import * as Debug from '../Debug/Debug.js'
import * as ParentIpc from '../MainProcess/MainProcess.js'
import * as Platform from '../Platform/Platform.js'

export const handleWindowAllClosed = async () => {
  Debug.debug('[info] all windows closed')
  if (!Platform.isMacOs) {
    Debug.debug('[info] quitting')
    await ParentIpc.invoke('Exit.exit')
  }
}
