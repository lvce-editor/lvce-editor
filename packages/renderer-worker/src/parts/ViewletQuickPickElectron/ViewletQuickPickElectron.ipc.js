import * as ViewletQuickPickElectron from './ViewletQuickPickElectron.js'

// prettier-ignore
export const Commands = {
  handleBeforeInput: ViewletQuickPickElectron.handleBeforeInput,
  handleBlur: ViewletQuickPickElectron.handleBlur,
  handleClickAt: ViewletQuickPickElectron.handleClickAt,
  handleInput: ViewletQuickPickElectron.handleInput,
  handleWheel: ViewletQuickPickElectron.handleWheel,
  selectCurrentIndex: ViewletQuickPickElectron.selectCurrentIndex,
  selectIndex: ViewletQuickPickElectron.selectIndex,
  selectItem: ViewletQuickPickElectron.selectItem,
}

// prettier-ignore
export const LazyCommands = {
  focusFirst: () => import('../ViewletQuickPick/ViewletQuickPickFocusFirst.js'),
  focusIndex: () => import('../ViewletQuickPick/ViewletQuickPickFocusIndex.js'),
  focusLast: () => import('../ViewletQuickPick/ViewletQuickPickFocusLast.js'),
  focusNext: () => import('../ViewletQuickPick/ViewletQuickPickFocusNext.js'),
  focusPrevious: () => import('../ViewletQuickPick/ViewletQuickPickFocusPrevious.js'),
}

export * from './ViewletQuickPickElectron.js'
