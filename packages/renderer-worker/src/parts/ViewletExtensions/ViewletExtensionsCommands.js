import * as VirtualList from '../VirtualList/VirtualList.ipc.js'
import * as ViewletExtensions from './ViewletExtensions.js'

// prettier-ignore
export const Commands = {
  closeSuggest: ViewletExtensions.closeSuggest,
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
  handleContextMenu: () => import('./ViewletExtensionsHandleContextMenu.js'),
  clearSearchResults: () => import('./ViewletExtensionsClearSearchResults.js'),
  handleInput: () => import('./ViewletExtensionsHandleInput.js'),
  handleFocus: () => import('./ViewletExtensionsHandleFocus.js'),
  ...VirtualList.LazyCommands
}
