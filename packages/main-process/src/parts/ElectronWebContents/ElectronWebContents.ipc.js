import * as ElectronWebContents from './ElectronWebContents.js'

export const name = 'ElectronWebContents'

export const Commands = {
  dispose: ElectronWebContents.dispose,
  getStats: ElectronWebContents.getStats,
}
