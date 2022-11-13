import * as SimpleBrowser from './ViewletSimpleBrowser.js'

export const name = 'SimpleBrowser'

// prettier-ignore
export const Commands = {
  backward: SimpleBrowser.backward,
  forward: SimpleBrowser.forward,
  go: SimpleBrowser.go,
  handleInput: SimpleBrowser.handleInput,
  handleTitleUpdated: SimpleBrowser.handleTitleUpdated,
  handleWillNavigate: SimpleBrowser.handleWillNavigate,
  openDevtools: SimpleBrowser.openDevtools,
  reload: SimpleBrowser.reload,
}

export const LazyCommands = {
  openExternal: () => import('./ViewletSimpleBrowserOpenExternal.js'),
  openBackgroundTab: () => import('./ViewletSimpleBrowserOpenBackgroundTab.js'),
  handleContextMenu: () => import('./ViewletSimpleBrowserHandleContextMenu.js'),
  inspectElement: () => import('./ViewletSimpleBrowserInspectElement.js'),
  copyImage: () => import('./ViewletSimpleBrowserCopyImage.js'),
}

export const Css = [
  '/css/parts/ViewletSimpleBrowser.css',
  '/css/parts/IconButton.css',
]

export * from './ViewletSimpleBrowser.js'
