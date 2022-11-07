import * as ViewletExtensions from './ViewletExtensions.js'
import * as LazyCommand from '../LazyCommand/LazyCommand.js'

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
  focusFirst: LazyCommand.create(ViewletExtensions.name, Imports.FocusFirst, 'focusFirst'),
  focusIndex: LazyCommand.create(ViewletExtensions.name, Imports.FocusIndex, 'focusIndex'),
  focusLast: LazyCommand.create(ViewletExtensions.name, Imports.FocusLast, 'focusLast'),
  focusNext: LazyCommand.create(ViewletExtensions.name, Imports.FocusNext, 'focusNext'),
  focusNextPage: LazyCommand.create(ViewletExtensions.name, Imports.FocusNextPage, 'focusNextPage'),
  focusPrevious: LazyCommand.create(ViewletExtensions.name, Imports.FocusPrevious, 'focusPrevious'),
  focusPreviousPage: LazyCommand.create(Imports.FocusPreviousPage, 'focusPreviousPage'),
  handleClick: LazyCommand.create(ViewletExtensions.name, Imports.HandleClick, 'handleClick'),
  handleClickCurrent: LazyCommand.create(ViewletExtensions.name, Imports.HandleClickCurrent, 'handleClickCurrent'),
  handleClickCurrentButKeepFocus: LazyCommand.create(ViewletExtensions.name, Imports.HandleClickCurrentButKeepFocus, 'handleClickCurrentButKeepFocus'),
  handleContextMenu: ViewletExtensions.handleContextMenu,
  handleInput: ViewletExtensions.handleInput,
  handleInstall: ViewletExtensions.handleInstall,
  handleScrollBarClick: LazyCommand.create(ViewletExtensions.name, Imports.HandleScrollBarClick, 'handleScrollBarClick'),
  handleScrollBarMove: LazyCommand.create(ViewletExtensions.name, Imports.HandleScrollBarMove, 'handleScrollBarMove'),
  handleTouchEnd: LazyCommand.create(ViewletExtensions.name, Imports.HandleTouchEnd, 'handleTouchEnd'),
  handleTouchMove: LazyCommand.create(ViewletExtensions.name, Imports.HandleTouchMove, 'handleTouchMove'),
  handleTouchStart: LazyCommand.create(ViewletExtensions.name, Imports.HandleTouchStart, 'handleTouchStart'),
  handleUninstall: ViewletExtensions.handleUninstall,
  handleWheel: LazyCommand.create(ViewletExtensions.name, Imports.HandleWheel, 'handleWheel'),
  openSuggest: ViewletExtensions.openSuggest,
  setDeltaY: LazyCommand.create(ViewletExtensions.name, Imports.SetDeltaY, 'setDeltaY'),
  toggleSuggest: ViewletExtensions.toggleSuggest,
}

export const Css = '/css/parts/ViewletExtensions.css'

export * from './ViewletExtensions.js'
