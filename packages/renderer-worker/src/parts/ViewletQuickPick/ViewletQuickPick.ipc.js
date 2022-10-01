import * as ViewletQuickPick from './ViewletQuickPick.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
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
  'QuickPick.handleBeforeInput': Viewlet.wrapViewletCommand(ViewletQuickPick.name, ViewletQuickPick.handleBeforeInput),
  'QuickPick.handleBlur': Viewlet.wrapViewletCommand(ViewletQuickPick.name, ViewletQuickPick.handleBlur),
  'QuickPick.handleInput': Viewlet.wrapViewletCommand(ViewletQuickPick.name, ViewletQuickPick.handleInput),
  'QuickPick.handleWheel': Viewlet.wrapViewletCommand(ViewletQuickPick.name, ViewletQuickPick.handleWheel),
  'QuickPick.selectCurrentIndex': Viewlet.wrapViewletCommand(ViewletQuickPick.name, ViewletQuickPick.selectCurrentIndex),
  'QuickPick.selectIndex': Viewlet.wrapViewletCommand(ViewletQuickPick.name, ViewletQuickPick.selectIndex),
  'QuickPick.selectItem': Viewlet.wrapViewletCommand(ViewletQuickPick.name, ViewletQuickPick.selectItem),
  'QuickPick.handleClickAt': Viewlet.wrapViewletCommand(ViewletQuickPick.name, ViewletQuickPick.handleClickAt),
}

export * from './ViewletQuickPick.js'
