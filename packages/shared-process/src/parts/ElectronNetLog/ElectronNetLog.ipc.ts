import * as ElectronNetLog from './ElectronNetLog.ts'

export const name = 'ElectronNetLog'

export const Commands = {
  startLogging: ElectronNetLog.startLogging,
  stopLogging: ElectronNetLog.stopLogging,
}
