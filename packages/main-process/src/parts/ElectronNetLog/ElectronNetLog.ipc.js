import * as ElectronNetLog from './ElectronNetLog.js'

export const name = 'ElectronNetLog'

export const Commands = {
  startLogging: ElectronNetLog.startLogging,
  stopLogging: ElectronNetLog.stopLogging,
}
