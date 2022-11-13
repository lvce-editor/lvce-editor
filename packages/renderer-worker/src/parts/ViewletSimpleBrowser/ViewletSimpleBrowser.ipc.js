import * as SimpleBrowser from './ViewletSimpleBrowser.js'

export const name = 'SimpleBrowser'

// prettier-ignore
export const Commands = {
  go: SimpleBrowser.go,
  handleInput: SimpleBrowser.handleInput,
  handleTitleUpdated: SimpleBrowser.handleTitleUpdated,
  handleWillNavigate: SimpleBrowser.handleWillNavigate,
  handleDidNavigate: SimpleBrowser.handleDidNavigate,
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

export const Css = [
  '/css/parts/ViewletSimpleBrowser.css',
  '/css/parts/IconButton.css',
]

export * from './ViewletSimpleBrowser.js'
