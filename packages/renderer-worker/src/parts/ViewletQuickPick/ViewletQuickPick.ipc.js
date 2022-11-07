import * as ViewletQuickPick from './ViewletQuickPick.js'
import * as LazyCommand from '../LazyCommand/LazyCommand.js'

// prettier-ignore
const Imports = {
  FocusFirst: () => import('./ViewletQuickPickFocusFirst.js'),
  FocusIndex: () => import('./ViewletQuickPickFocusIndex.js'),
  FocusLast: () => import('./ViewletQuickPickFocusLast.js'),
  FocusNext: () => import('./ViewletQuickPickFocusNext.js'),
  FocusPrevious: () => import('./ViewletQuickPickFocusPrevious.js'),
}

// prettier-ignore
export const Commands = {
  focusFirst: LazyCommand.create(ViewletQuickPick.name, Imports.FocusFirst, 'focusFirst'),
  focusIndex: LazyCommand.create(ViewletQuickPick.name, Imports.FocusIndex, 'focusIndex'),
  focusLast: LazyCommand.create(ViewletQuickPick.name, Imports.FocusLast, 'focusLast'),
  focusNext: LazyCommand.create(ViewletQuickPick.name, Imports.FocusNext, 'focusNext'),
  focusPrevious: LazyCommand.create(ViewletQuickPick.name, Imports.FocusPrevious, 'focusPrevious'),
  handleBeforeInput: ViewletQuickPick.handleBeforeInput,
  handleBlur: ViewletQuickPick.handleBlur,
  handleClickAt: ViewletQuickPick.handleClickAt,
  handleInput: ViewletQuickPick.handleInput,
  handleWheel: ViewletQuickPick.handleWheel,
  selectCurrentIndex: ViewletQuickPick.selectCurrentIndex,
  selectIndex: ViewletQuickPick.selectIndex,
  selectItem: ViewletQuickPick.selectItem,
}

export const Css = '/css/parts/ViewletQuickPick.css'

export * from './ViewletQuickPick.js'
