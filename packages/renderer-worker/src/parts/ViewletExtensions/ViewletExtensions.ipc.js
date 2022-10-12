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
  HandleTouchStart: () => import('./ViewletExtensionsHandleTouchStart.js'),
  HandleTouchEnd: () => import('./ViewletExtensionsHandleTouchEnd.js'),
  HandleTouchMove: () => import('./ViewletExtensionsHandleTouchMove.js'),
  HandleClickCurrent: () => import('./ViewletExtensionsHandleClickCurrent.js'),
  HandleClickCurrentButKeepFocus: () => import('./ViewletExtensionsHandleClickCurrentButKeepFocus.js'),
}

// prettier-ignore
export const Commands = {
  'Extensions.closeSuggest': ViewletExtensions.closeSuggest,
  'Extensions.focusFirst': LazyCommand.create(ViewletExtensions.name, Imports.FocusFirst, 'focusFirst'),
  'Extensions.focusIndex': LazyCommand.create(ViewletExtensions.name, Imports.FocusIndex, 'focusIndex'),
  'Extensions.focusLast': LazyCommand.create(ViewletExtensions.name, Imports.FocusLast, 'focusLast'),
  'Extensions.focusNext': LazyCommand.create(ViewletExtensions.name, Imports.FocusNext, 'focusNext'),
  'Extensions.focusNextPage': LazyCommand.create(ViewletExtensions.name, Imports.FocusNextPage, 'focusNextPage'),
  'Extensions.focusPrevious': LazyCommand.create(ViewletExtensions.name, Imports.FocusPrevious, 'focusPrevious'),
  'Extensions.focusPreviousPage': LazyCommand.create(Imports.FocusPreviousPage, 'focusPreviousPage'),
  'Extensions.handleClick': LazyCommand.create(ViewletExtensions.name, Imports.HandleClick, 'handleClick'),
  'Extensions.handleClickCurrent': LazyCommand.create(ViewletExtensions.name, Imports.HandleClickCurrent, 'handleClickCurrent'),
  'Extensions.handleClickCurrentButKeepFocus': LazyCommand.create(ViewletExtensions.name, Imports.HandleClickCurrentButKeepFocus, 'handleClickCurrentButKeepFocus'),
  'Extensions.handleContextMenu': ViewletExtensions.handleContextMenu,
  'Extensions.handleInput': ViewletExtensions.handleInput,
  'Extensions.handleInstall': ViewletExtensions.handleInstall,
  'Extensions.handleScrollBarClick': ViewletExtensions.handleScrollBarClick,
  'Extensions.handleScrollBarMove': ViewletExtensions.handleScrollBarMove,
  'Extensions.handleTouchEnd':LazyCommand.create(ViewletExtensions.name, Imports.HandleTouchEnd, 'handleTouchEnd'),
  'Extensions.handleTouchMove':LazyCommand.create(ViewletExtensions.name, Imports.HandleTouchMove, 'handleTouchMove'),
  'Extensions.handleTouchStart': LazyCommand.create(ViewletExtensions.name, Imports.HandleTouchStart, 'handleTouchStart'),
  'Extensions.handleUninstall': ViewletExtensions.handleUninstall,
  'Extensions.handleWheel': ViewletExtensions.handleWheel,
  'Extensions.openSuggest': ViewletExtensions.openSuggest,
  'Extensions.setDeltaY': ViewletExtensions.setDeltaY,
  'Extensions.toggleSuggest': ViewletExtensions.toggleSuggest,
}

export * from './ViewletExtensions.js'
