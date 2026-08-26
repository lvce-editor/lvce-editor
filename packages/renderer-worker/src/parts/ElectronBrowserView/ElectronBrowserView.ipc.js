import * as ElectronBrowserView from './ElectronBrowserView.js'

export const name = 'ElectronBrowserView'

export const Commands = {
  handleDidNavigate: ElectronBrowserView.handleDidNavigate,
  handlePageFaviconUpdated: ElectronBrowserView.handlePageFaviconUpdated,
  handleTitleUpdated: ElectronBrowserView.handleTitleUpdated,
  handleWillNavigate: ElectronBrowserView.handleWillNavigate,
}
