import * as ElectronBrowserView from './ElectronBrowserView.js'

export const name = 'ElectronBrowserView'

export const Commands = {
  createBrowserView: ElectronBrowserView.createBrowserView,
  createBrowserView2: ElectronBrowserView.createBrowserView2,
  attachEventListeners: ElectronBrowserView.attachEventListeners,
  disposeBrowserView: ElectronBrowserView.disposeBrowserView,
  getAll: ElectronBrowserView.getAll,
}
