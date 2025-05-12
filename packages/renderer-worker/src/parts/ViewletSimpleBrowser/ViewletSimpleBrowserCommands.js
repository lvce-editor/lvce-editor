import * as SimpleBrowser from './ViewletSimpleBrowser.js'
import * as ViewletSimpleBrowserGetDomTree from './ViewletSimpleBrowserGetDomTree.js'

// prettier-ignore
export const Commands = {
  go: SimpleBrowser.go,
  setUrl: SimpleBrowser.setUrl,
  handleDidNavigate: SimpleBrowser.handleDidNavigate,
  handleDidNavigationCancel: SimpleBrowser.handleDidNavigationCancel,
  handleInput: SimpleBrowser.handleInput,
  handleTitleUpdated: SimpleBrowser.handleTitleUpdated,
  handleWillNavigate: SimpleBrowser.handleWillNavigate,
  handleKeyBinding: SimpleBrowser.handleKeyBinding,
  getDomTree:ViewletSimpleBrowserGetDomTree.getDomTree
}

export const LazyCommands = {
  openExternal: () => import('./ViewletSimpleBrowserOpenExternal.js'),
  openBackgroundTab: () => import('./ViewletSimpleBrowserOpenBackgroundTab.js'),
  handleContextMenu: () => import('./ViewletSimpleBrowserHandleContextMenu.js'),
  inspectElement: () => import('./ViewletSimpleBrowserInspectElement.js'),
  copyImage: () => import('./ViewletSimpleBrowserCopyImage.js'),
  backward: () => import('./ViewletSimpleBrowserBackward.js'),
  forward: () => import('./ViewletSimpleBrowserForward.js'),
  openDevtools: () => import('./ViewletSimpleBrowserOpenDevtools.js'),
  reload: () => import('./ViewletSimpleBrowserReload.js'),
  cancelNavigation: () => import('./ViewletSimpleBrowserCancelNavigation.js'),
}

export const Events = {
  'browser-view-did-navigate': SimpleBrowser.handleDidNavigate,
  'browser-view-title-updated': SimpleBrowser.handleTitleUpdated,
  'browser-view-will-navigate': SimpleBrowser.handleWillNavigate,
}
