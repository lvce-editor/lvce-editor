import * as ElectronBrowserView from './ElectronBrowserView.js'

export const name = 'ElectronBrowserView'

export const Commands = {
  handleAudioStateChanged: ElectronBrowserView.handleAudioStateChanged,
  handleBrowserViewDestroyed: ElectronBrowserView.handleBrowserViewDestroyed,
  handleContextMenu: ElectronBrowserView.handleContextMenu,
  handleDidNavigate: ElectronBrowserView.handleDidNavigate,
  handleKeyBinding: ElectronBrowserView.handleKeyBinding,
  handlePageFaviconUpdated: ElectronBrowserView.handlePageFaviconUpdated,
  handleTitleUpdated: ElectronBrowserView.handleTitleUpdated,
  handleWillNavigate: ElectronBrowserView.handleWillNavigate,
  handleWindowOpen: ElectronBrowserView.handleWindowOpen,
}
