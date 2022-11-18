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
  focusFirst: () => import('./ViewletQuickPickFocusFirst.js'),
  focusIndex: () => import('./ViewletQuickPickFocusIndex.js'),
  focusLast: () => import('./ViewletQuickPickFocusLast.js'),
  focusNext: () => import('./ViewletQuickPickFocusNext.js'),
  focusPrevious: () => import('./ViewletQuickPickFocusPrevious.js'),
}

export const Css = [
  '/css/parts/ViewletQuickPick.css',
  '/css/parts/InputBox.css',
  '/css/parts/Highlight.css',
]

export * from './ViewletQuickPick.js'
