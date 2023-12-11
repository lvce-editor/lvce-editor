import * as Debug from '../Debug/Debug.js'
import * as ElectronApp from '../ElectronApp/ElectronApp.js'
import * as Platform from '../Platform/Platform.js'

// TODO move this function to shared process
export const handleWindowAllClosed = () => {
  Debug.debug('[info] all windows closed')
  if (!Platform.isMacOs) {
    Debug.debug('[info] quitting')
    ElectronApp.quit()
  }
}
