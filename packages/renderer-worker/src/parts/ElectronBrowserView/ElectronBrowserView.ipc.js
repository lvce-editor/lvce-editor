import * as ElectronBrowserView from './ElectronBrowserView.js'

export const name = 'ElectronBrowserView'

export const Commands = {
  handleDidNavigate: ElectronBrowserView.handleDidNavigate,
  handleTitleUpdated: ElectronBrowserView.handleTitleUpdated,
  handleWillNavigate: ElectronBrowserView.handleWillNavigate,
  handleKeyBinding: ElectronBrowserView.handleKeyBinding,
}
