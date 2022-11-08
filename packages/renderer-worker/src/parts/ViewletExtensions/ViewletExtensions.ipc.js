import * as ViewletExtensions from './ViewletExtensions.js'

// prettier-ignore
const Imports = {
  FocusFirst: () => import('./ViewletExtensionsFocusFirst.js'),
  FocusIndex: () => import('./ViewletExtensionsFocusIndex.js'),
  FocusLast: () => import('./ViewletExtensionsFocusLast.js'),
  FocusNext: () => import('./ViewletExtensionsFocusNext.js'),
  FocusNextPage: () => import('./ViewletExtensionsFocusNextPage.js'),
  FocusPrevious: () => import('./ViewletExtensionsFocusPrevious.js'),
  FocusPreviousPage: () => import('./ViewletExtensionsFocusPreviousPage.js'),
  HandleClick: () => import('./ViewletExtensionsHandleClick.js'),
  HandleClickCurrent: () => import('./ViewletExtensionsHandleClickCurrent.js'),
  HandleClickCurrentButKeepFocus: () => import('./ViewletExtensionsHandleClickCurrentButKeepFocus.js'),
  HandleScrollBarClick: () => import('./ViewletExtensionsHandleScrollBarClick.js'),
  HandleScrollBarMove: () => import('./ViewletExtensionsHandleScrollBarMove.js'),
  HandleTouchEnd: () => import('./ViewletExtensionsHandleTouchEnd.js'),
  HandleTouchMove: () => import('./ViewletExtensionsHandleTouchMove.js'),
  HandleTouchStart: () => import('./ViewletExtensionsHandleTouchStart.js'),
  HandleWheel: () => import('./ViewletExtensionsHandleWheel.js'),
  SetDeltaY: () => import('./ViewletExtensionsSetDeltaY.js'),
}

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

export const LazyCommands = {
  focusFirst: Imports.FocusFirst,
  focusIndex: Imports.FocusIndex,
  focusLast: Imports.FocusLast,
  focusNext: Imports.FocusNext,
  focusNextPage: Imports.FocusNextPage,
  focusPrevious: Imports.FocusPrevious,
  focusPreviousPage: Imports.FocusPreviousPage,
  handleClick: Imports.HandleClick,
  handleClickCurrent: Imports.HandleClickCurrent,
  handleClickCurrentButKeepFocus: Imports.HandleClickCurrentButKeepFocus,
  handleScrollBarClick: Imports.HandleScrollBarClick,
  handleScrollBarMove: Imports.HandleScrollBarMove,
  handleTouchEnd: Imports.HandleTouchEnd,
  handleTouchMove: Imports.HandleTouchMove,
  handleTouchStart: Imports.HandleTouchStart,
  handleWheel: Imports.HandleWheel,
  setDeltaY: Imports.SetDeltaY,
}

export const Css = '/css/parts/ViewletExtensions.css'

export * from './ViewletExtensions.js'
