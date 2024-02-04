import * as ElectronBrowserView from './ElectronBrowserView.js'

export const name = 'ElectronBrowserView'

export const Commands = {
  createBrowserView: ElectronBrowserView.createBrowserView,
  createBrowserView2: ElectronBrowserView.createBrowserView2,
  disposeBrowserView: ElectronBrowserView.disposeBrowserView,
  getAll: ElectronBrowserView.getAll,
}
