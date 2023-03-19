import * as ViewletQuickPick from './ViewletQuickPick.js'

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
  focusFirst: () => import('./ViewletQuickPickFocusFirst.js'),
  focusIndex: () => import('./ViewletQuickPickFocusIndex.js'),
  focusLast: () => import('./ViewletQuickPickFocusLast.js'),
  focusNext: () => import('./ViewletQuickPickFocusNext.js'),
  focusPrevious: () => import('./ViewletQuickPickFocusPrevious.js'),
  handleInput: () => import('./ViewletQuickPickHandleInput.js'),
  handleBeforeInput: () => import('./ViewletQuickPickHandleBeforeInput.js'),
}
