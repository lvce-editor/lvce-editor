import * as SimpleBrowser from './ViewletSimpleBrowser.js'
import * as LazyCommand from '../LazyCommand/LazyCommand.js'

const Imports = {
  OpenExternal: () => import('./ViewletSimpleBrowserOpenExternal.js'),
  OpenBackgroundTab: () => import('./ViewletSimpleBrowserOpenBackgroundTab.js'),
}

// prettier-ignore
export const Commands = {
  backward: SimpleBrowser.backward,
  forward: SimpleBrowser.forward,
  go: SimpleBrowser.go,
  handleInput: SimpleBrowser.handleInput,
  handleTitleUpdated: SimpleBrowser.handleTitleUpdated,
  handleWillNavigate: SimpleBrowser.handleWillNavigate,
  openBackgroundTab: LazyCommand.create(SimpleBrowser.name, Imports.OpenBackgroundTab, 'openBackgroundTab'),
  openDevtools: SimpleBrowser.openDevtools,
  openExternal: LazyCommand.create(SimpleBrowser.name, Imports.OpenExternal, 'openExternal'),
  reload: SimpleBrowser.reload,
}

export const Css = [
  '/css/parts/ViewletSimpleBrowser.css',
  '/css/parts/IconButton.css',
]

export * from './ViewletSimpleBrowser.js'
