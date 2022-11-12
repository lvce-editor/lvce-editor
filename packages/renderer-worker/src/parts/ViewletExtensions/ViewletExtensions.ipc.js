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
  focusFirst: () => import('../VirtualList/VirtualListFocusFirst.js'),
  focusIndex: () => import('../VirtualList/VirtualListFocusIndex.js'),
  focusLast: () => import('../VirtualList/VirtualListFocusLast.js'),
  focusNext: () => import('../VirtualList/VirtualListFocusNext.js'),
  focusNextPage: () => import('./ViewletExtensionsFocusNextPage.js'),
  focusPrevious: () => import('../VirtualList/VirtualListFocusPrevious.js'),
  focusPreviousPage: () => import('./ViewletExtensionsFocusPreviousPage.js'),
  handleClick: () => import('./ViewletExtensionsHandleClick.js'),
  handleClickCurrent: () => import('./ViewletExtensionsHandleClickCurrent.js'),
  handleClickCurrentButKeepFocus: () => import('./ViewletExtensionsHandleClickCurrentButKeepFocus.js'),
  handleScrollBarClick: () => import('../VirtualList/VirtualListHandleScrollBarClick.js'),
  handleScrollBarMove: () => import('../VirtualList/VirtualListHandleScrollBarMove.js'),
  handleTouchEnd: () => import('./ViewletExtensionsHandleTouchEnd.js'),
  handleTouchMove: () => import('./ViewletExtensionsHandleTouchMove.js'),
  handleTouchStart: () => import('./ViewletExtensionsHandleTouchStart.js'),
  handleWheel: () => import('../VirtualList/VirtualList.js'),
  setDeltaY: () => import('../VirtualList/VirtualList.js'),
}

export const Css = [
  '/css/parts/ViewletExtensions.css',
  '/css/parts/ViewletList.css',
]

export * from './ViewletExtensions.js'
