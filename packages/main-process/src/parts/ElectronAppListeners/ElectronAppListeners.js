import * as Debug from '../Debug/Debug.js'
import * as LifeCycle from '../LifeCycle/LifeCycle.js'

// TODO move this function to shared process
export const handleBeforeQuit = () => {
  LifeCycle.setShutDown()
  Debug.debug('[info] before quit')
}
