import * as ViewletQuickPick from './ViewletQuickPick.js'

export const name = 'QuickPick'

// prettier-ignore
export const Commands = {
  handleBlur: ViewletQuickPick.handleBlur,
  handleClickAt: ViewletQuickPick.handleClickAt,
  handleWheel: ViewletQuickPick.handleWheel,
  selectCurrentIndex: ViewletQuickPick.selectCurrentIndex,
  selectIndex: ViewletQuickPick.selectIndex,
  selectItem: ViewletQuickPick.selectItem,
}

// prettier-ignore
export const LazyCommands = {
  cursorLeft: () => import('./ViewletQuickPickCursorLeft.js'),
  cursorRight: () => import('./ViewletQuickPickCursorRight.js'),
  deleteCharacterLeft: () => import('./ViewletQuickPickDeleteCharacterLeft.js'),
  focusFirst: () => import('./ViewletQuickPickFocusFirst.js'),
  focusIndex: () => import('./ViewletQuickPickFocusIndex.js'),
  focusLast: () => import('./ViewletQuickPickFocusLast.js'),
  focusNext: () => import('./ViewletQuickPickFocusNext.js'),
  focusPrevious: () => import('./ViewletQuickPickFocusPrevious.js'),
  handleBeforeInput: () => import('./ViewletQuickPickHandleBeforeInput.js'),
  handleInput: () => import('./ViewletQuickPickHandleInput.js'),
}

export const Css = ['/css/parts/ViewletQuickPick.css', '/css/parts/InputBox.css']

export * from './ViewletQuickPick.js'
