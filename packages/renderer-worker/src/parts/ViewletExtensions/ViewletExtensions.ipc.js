import * as ViewletExtensions from './ViewletExtensions.js'

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
  focusFirst: () => import('./ViewletExtensionsFocusFirst.js'),
  focusIndex: () => import('./ViewletExtensionsFocusIndex.js'),
  focusLast: () => import('./ViewletExtensionsFocusLast.js'),
  focusNext: () => import('./ViewletExtensionsFocusNext.js'),
  focusNextPage: () => import('./ViewletExtensionsFocusNextPage.js'),
  focusPrevious: () => import('./ViewletExtensionsFocusPrevious.js'),
  focusPreviousPage: () => import('./ViewletExtensionsFocusPreviousPage.js'),
  handleClick: () => import('./ViewletExtensionsHandleClick.js'),
  handleClickCurrent: () => import('./ViewletExtensionsHandleClickCurrent.js'),
  handleClickCurrentButKeepFocus: () => import('./ViewletExtensionsHandleClickCurrentButKeepFocus.js'),
  handleScrollBarClick: () => import('./ViewletExtensionsHandleScrollBarClick.js'),
  handleScrollBarMove: () => import('./ViewletExtensionsHandleScrollBarMove.js'),
  handleTouchEnd: () => import('./ViewletExtensionsHandleTouchEnd.js'),
  handleTouchMove: () => import('./ViewletExtensionsHandleTouchMove.js'),
  handleTouchStart: () => import('./ViewletExtensionsHandleTouchStart.js'),
  handleWheel: () => import('./ViewletExtensionsHandleWheel.js'),
  setDeltaY: () => import('./ViewletExtensionsSetDeltaY.js'),
}

export const Css = '/css/parts/ViewletExtensions.css'

export * from './ViewletExtensions.js'
