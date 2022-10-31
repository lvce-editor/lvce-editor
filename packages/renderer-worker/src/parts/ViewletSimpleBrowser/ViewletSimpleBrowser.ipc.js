import * as SimpleBrowser from './ViewletSimpleBrowser.js'
import * as LazyCommand from '../LazyCommand/LazyCommand.js'

const Imports = {
  OpenExternal: () => import('./ViewletSimpleBrowserOpenExternal.js'),
  OpenBackgroundTab: () => import('./ViewletSimpleBrowserOpenBackgroundTab.js'),
}

// prettier-ignore
export const Commands = {
  'SimpleBrowser.backward': SimpleBrowser.backward,
  'SimpleBrowser.forward': SimpleBrowser.forward,
  'SimpleBrowser.go': SimpleBrowser.go,
  'SimpleBrowser.handleInput': SimpleBrowser.handleInput,
  'SimpleBrowser.handleTitleUpdated': SimpleBrowser.handleTitleUpdated,
  'SimpleBrowser.handleWillNavigate': SimpleBrowser.handleWillNavigate,
  'SimpleBrowser.openBackgroundTab': LazyCommand.create(SimpleBrowser.name, Imports.OpenBackgroundTab, 'openBackgroundTab'),
  'SimpleBrowser.openDevtools': SimpleBrowser.openDevtools,
  'SimpleBrowser.openExternal': LazyCommand.create(SimpleBrowser.name, Imports.OpenExternal, 'openExternal'),
  'SimpleBrowser.reload': SimpleBrowser.reload,
}

export const Css = '/css/parts/ViewletSimpleBrowser.css'

export * from './ViewletSimpleBrowser.js'
