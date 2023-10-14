import * as ElectronBrowserViewQuickPick from './ElectronBrowserViewQuickPick.js'

export const name = 'ElectronBrowserViewQuickPick'

export const Commands = {
  startLogging: ElectronBrowserViewQuickPick.createBrowserViewQuickPick,
  disposeBrowserViewQuickPick: ElectronBrowserViewQuickPick.disposeBrowserViewQuickPick,
}
