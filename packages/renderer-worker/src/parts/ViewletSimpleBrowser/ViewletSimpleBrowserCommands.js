import * as SimpleBrowser from './ViewletSimpleBrowser.js'
import * as ViewletSimpleBrowserGetDomTree from './ViewletSimpleBrowserGetDomTree.js'
import * as ViewletSimpleBrowserHandleContextMenu from './ViewletSimpleBrowserHandleContextMenu.js'
import * as ViewletSimpleBrowserInsertCss from './ViewletSimpleBrowserInsertCss.js'
import * as ViewletSimpleBrowserInsertJavaScript from './ViewletSimpleBrowserInsertJavaScript.js'

export const Commands = {
  acceptSuggestion: SimpleBrowser.acceptSuggestion,
  applySuggestions: SimpleBrowser.applySuggestions,
  closeSuggestions: SimpleBrowser.closeSuggestions,
  closeTab: SimpleBrowser.closeTab,
  createNewTab: SimpleBrowser.createNewTab,
  getDomTree: ViewletSimpleBrowserGetDomTree.getDomTree,
  go: SimpleBrowser.go,
  handleAudioStateChanged: SimpleBrowser.handleAudioStateChanged,
  handleDidNavigate: SimpleBrowser.handleDidNavigate,
  handleDidNavigationCancel: SimpleBrowser.handleDidNavigationCancel,
  handleInput: SimpleBrowser.handleInput,
  handleKeyBinding: SimpleBrowser.handleKeyBinding,
  handlePageFaviconUpdated: SimpleBrowser.handlePageFaviconUpdated,
  handleTitleUpdated: SimpleBrowser.handleTitleUpdated,
  handleWillNavigate: SimpleBrowser.handleWillNavigate,
  hideOverlay: SimpleBrowser.hideOverlay,
  insertCss: ViewletSimpleBrowserInsertCss.insertCss,
  insertJavaScript: ViewletSimpleBrowserInsertJavaScript.insertJavaScript,
  setUrl: SimpleBrowser.setUrl,
  selectNextSuggestion: SimpleBrowser.selectNextSuggestion,
  selectPreviousSuggestion: SimpleBrowser.selectPreviousSuggestion,
  selectTab: SimpleBrowser.selectTab,
  showOverlay: SimpleBrowser.showOverlay,
}

export const LazyCommands = {
  openExternal: () => import('./ViewletSimpleBrowserOpenExternal.js'),
  openBackgroundTab: () => import('./ViewletSimpleBrowserOpenBackgroundTab.js'),
  handleContextMenu: () => import('./ViewletSimpleBrowserHandleContextMenu.js'),
  inspectElement: () => import('./ViewletSimpleBrowserInspectElement.js'),
  copyImage: () => import('./ViewletSimpleBrowserCopyImage.js'),
  backward: () => import('./ViewletSimpleBrowserBackward.js'),
  forward: () => import('./ViewletSimpleBrowserForward.js'),
  importFirefoxCookies: () => import('./ViewletSimpleBrowserImportFirefoxCookies.js'),
  openDevtools: () => import('./ViewletSimpleBrowserOpenDevtools.js'),
  reload: () => import('./ViewletSimpleBrowserReload.js'),
  cancelNavigation: () => import('./ViewletSimpleBrowserCancelNavigation.js'),
}

export const Events = {
  'browser-view-audio-state-changed': SimpleBrowser.handleAudioStateChanged,
  'browser-view-context-menu': ViewletSimpleBrowserHandleContextMenu.handleContextMenu,
  'browser-view-did-navigate': SimpleBrowser.handleDidNavigate,
  'browser-view-key-binding': SimpleBrowser.handleKeyBinding,
  'browser-view-page-favicon-updated': SimpleBrowser.handlePageFaviconUpdated,
  'browser-view-title-updated': SimpleBrowser.handleTitleUpdated,
  'browser-view-will-navigate': SimpleBrowser.handleWillNavigate,
  'browser-view-window-open': SimpleBrowser.handleWindowOpen,
}
