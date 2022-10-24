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
  'QuickPick.focusFirst': LazyCommand.create(ViewletQuickPick.name, Imports.FocusFirst, 'focusFirst'),
  'QuickPick.focusIndex': LazyCommand.create(ViewletQuickPick.name, Imports.FocusIndex, 'focusIndex'),
  'QuickPick.focusLast': LazyCommand.create(ViewletQuickPick.name, Imports.FocusLast, 'focusLast'),
  'QuickPick.focusNext': LazyCommand.create(ViewletQuickPick.name, Imports.FocusNext, 'focusNext'),
  'QuickPick.focusPrevious': LazyCommand.create(ViewletQuickPick.name, Imports.FocusPrevious, 'focusPrevious'),
  'QuickPick.handleBeforeInput': ViewletQuickPick.handleBeforeInput,
  'QuickPick.handleBlur': ViewletQuickPick.handleBlur,
  'QuickPick.handleClickAt': ViewletQuickPick.handleClickAt,
  'QuickPick.handleInput': ViewletQuickPick.handleInput,
  'QuickPick.handleWheel': ViewletQuickPick.handleWheel,
  'QuickPick.selectCurrentIndex': ViewletQuickPick.selectCurrentIndex,
  'QuickPick.selectIndex': ViewletQuickPick.selectIndex,
  'QuickPick.selectItem': ViewletQuickPick.selectItem,
}

export const css = '/css/parts/ViewletQuickPick.css'

export * from './ViewletQuickPick.js'
