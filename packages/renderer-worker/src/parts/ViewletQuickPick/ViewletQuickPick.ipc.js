import * as ViewletQuickPick from './ViewletQuickPick.js'

export const name = 'QuickPick'

// prettier-ignore
export const Commands = {
  handleBeforeInput: ViewletQuickPick.handleBeforeInput,
  handleBlur: ViewletQuickPick.handleBlur,
  handleClickAt: ViewletQuickPick.handleClickAt,
  handleInput: ViewletQuickPick.handleInput,
  handleWheel: ViewletQuickPick.handleWheel,
  selectCurrentIndex: ViewletQuickPick.selectCurrentIndex,
  selectIndex: ViewletQuickPick.selectIndex,
  selectItem: ViewletQuickPick.selectItem,
}

// prettier-ignore
export const LazyCommands = {
  cursorLeft: () => import('./ViewletQuickPickCursorLeft.js'),
  cursorRight: () => import('./ViewletQuickPickCursorRight.js'),
  deleteCharacterLeft: () => import('./ViewletQuickPickFocusDeleteCharacterLeft.js'),
  focusFirst: () => import('./ViewletQuickPickFocusFirst.js'),
  focusIndex: () => import('./ViewletQuickPickFocusIndex.js'),
  focusLast: () => import('./ViewletQuickPickFocusLast.js'),
  focusNext: () => import('./ViewletQuickPickFocusNext.js'),
  focusPrevious: () => import('./ViewletQuickPickFocusPrevious.js'),
  handleBeforeInput: () => import('./ViewletQuickPickHandleBeforeInput.js'),
}

export const Css = ['/css/parts/ViewletQuickPick.css', '/css/parts/InputBox.css']

export * from './ViewletQuickPick.js'
