import * as ViewletExtensions from './ViewletExtensions.js'
import * as VirtualList from '../VirtualList/VirtualList.ipc.js'

// prettier-ignore
export const Commands = {
  closeSuggest: ViewletExtensions.closeSuggest,
  handleContextMenu: ViewletExtensions.handleContextMenu,
  handleInput: ViewletExtensions.handleInput,
  handleInstall: ViewletExtensions.handleInstall,
  handleUninstall: ViewletExtensions.handleUninstall,
  openSuggest: ViewletExtensions.openSuggest,
  toggleSuggest: ViewletExtensions.toggleSuggest,
}

// prettier-ignore
export const LazyCommands = {
  handleClick: () => import('./ViewletExtensionsHandleClick.js'),
  handleClickCurrent: () => import('./ViewletExtensionsHandleClickCurrent.js'),
  handleClickCurrentButKeepFocus: () => import('./ViewletExtensionsHandleClickCurrentButKeepFocus.js'),
  ...VirtualList.LazyCommands
}

export const Css = [
  '/css/parts/ViewletExtensions.css',
  '/css/parts/ViewletList.css',
]

export * from './ViewletExtensions.js'
