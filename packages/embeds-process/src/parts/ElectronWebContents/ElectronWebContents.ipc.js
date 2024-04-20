import * as ElectronWebContents from './ElectronWebContents.js'

export const name = 'ElectronWebContents'

export const Commands = {
  dispose: ElectronWebContents.dispose,
  handleKeyBinding: ElectronWebContents.handleKeyBinding,
  handleWindowOpen: ElectronWebContents.handleWindowOpen,
  handleWillNavigate: ElectronWebContents.handleWillNavigate,
  handleDidNavigate: ElectronWebContents.handleDidNavigate,
  handleContextMenu: ElectronWebContents.handleContextMenu,
  handleTitleUpdated: ElectronWebContents.handleTitleUpdated,
  handleBrowserViewDestroyed: ElectronWebContents.handleBrowserViewDestroyed, // TODO rename to webcontents
}
