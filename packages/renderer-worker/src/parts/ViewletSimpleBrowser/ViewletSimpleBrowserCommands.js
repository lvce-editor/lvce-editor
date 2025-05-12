import * as SimpleBrowser from './ViewletSimpleBrowser.js'
import * as ViewletSimpleBrowserGetDomTree from './ViewletSimpleBrowserGetDomTree.js'
import * as ViewletSimpleBrowserInsertCss from './ViewletSimpleBrowserInsertCss.js'

export const Commands = {
  getDomTree: ViewletSimpleBrowserGetDomTree.getDomTree,
  go: SimpleBrowser.go,
  handleDidNavigate: SimpleBrowser.handleDidNavigate,
  handleDidNavigationCancel: SimpleBrowser.handleDidNavigationCancel,
  handleInput: SimpleBrowser.handleInput,
  handleKeyBinding: SimpleBrowser.handleKeyBinding,
  handleTitleUpdated: SimpleBrowser.handleTitleUpdated,
  handleWillNavigate: SimpleBrowser.handleWillNavigate,
  insertCss: ViewletSimpleBrowserInsertCss.insertCss,
  setUrl: SimpleBrowser.setUrl,
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
