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
  'QuickPick.focusFirst': LazyCommand.create('QuickPick', Imports.FocusFirst, 'focusFirst'),
  'QuickPick.focusIndex': LazyCommand.create('QuickPick', Imports.FocusIndex, 'focusIndex'),
  'QuickPick.focusLast': LazyCommand.create('QuickPick', Imports.FocusLast, 'focusLast'),
  'QuickPick.focusNext': LazyCommand.create('QuickPick', Imports.FocusNext, 'focusNext'),
  'QuickPick.focusPrevious': LazyCommand.create('QuickPick', Imports.FocusPrevious, 'focusPrevious'),
  'QuickPick.handleBeforeInput': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.handleBeforeInput),
  'QuickPick.handleBlur': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.handleBlur),
  'QuickPick.handleInput': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.handleInput),
  'QuickPick.handleWheel': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.handleWheel),
  'QuickPick.selectCurrentIndex': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.selectCurrentIndex),
  'QuickPick.selectIndex': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.selectIndex),
  'QuickPick.selectItem': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.selectItem),
}

export * from './ViewletQuickPick.js'
