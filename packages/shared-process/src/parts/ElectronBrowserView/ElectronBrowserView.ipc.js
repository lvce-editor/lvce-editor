import * as ElectronBrowserView from './ElectronBrowserView.js'

export const name = 'ElectronBrowserView'

export const Commands = {
  createBrowserView: ElectronBrowserView.createBrowserView,
  disposeBrowserView: ElectronBrowserView.disposeBrowserView,
}
