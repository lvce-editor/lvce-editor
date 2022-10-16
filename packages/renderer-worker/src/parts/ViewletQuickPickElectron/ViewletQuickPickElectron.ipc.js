import * as ViewletQuickPickElectron from './ViewletQuickPickElectron.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as LazyCommand from '../LazyCommand/LazyCommand.js'

// prettier-ignore
const Imports = {
  FocusFirst: () => import('../ViewletQuickPick/ViewletQuickPickFocusFirst.js'),
  FocusIndex: () => import('../ViewletQuickPick/ViewletQuickPickFocusIndex.js'),
  FocusLast: () => import('../ViewletQuickPick/ViewletQuickPickFocusLast.js'),
  FocusNext: () => import('../ViewletQuickPick/ViewletQuickPickFocusNext.js'),
  FocusPrevious: () => import('../ViewletQuickPick/ViewletQuickPickFocusPrevious.js'),
}

// prettier-ignore
export const Commands = {
  'QuickPick.focusFirst': LazyCommand.create(ViewletQuickPickElectron.name, Imports.FocusFirst, 'focusFirst'),
  'QuickPick.focusIndex': LazyCommand.create(ViewletQuickPickElectron.name, Imports.FocusIndex, 'focusIndex'),
  'QuickPick.focusLast': LazyCommand.create(ViewletQuickPickElectron.name, Imports.FocusLast, 'focusLast'),
  'QuickPick.focusNext': LazyCommand.create(ViewletQuickPickElectron.name, Imports.FocusNext, 'focusNext'),
  'QuickPick.focusPrevious': LazyCommand.create(ViewletQuickPickElectron.name, Imports.FocusPrevious, 'focusPrevious'),
  'QuickPick.handleBeforeInput': Viewlet.wrapViewletCommand(ViewletQuickPickElectron.name, ViewletQuickPickElectron.handleBeforeInput),
  'QuickPick.handleBlur': Viewlet.wrapViewletCommand(ViewletQuickPickElectron.name, ViewletQuickPickElectron.handleBlur),
  'QuickPick.handleClickAt': Viewlet.wrapViewletCommand(ViewletQuickPickElectron.name, ViewletQuickPickElectron.handleClickAt),
  'QuickPick.handleInput': Viewlet.wrapViewletCommand(ViewletQuickPickElectron.name, ViewletQuickPickElectron.handleInput),
  'QuickPick.handleWheel': Viewlet.wrapViewletCommand(ViewletQuickPickElectron.name, ViewletQuickPickElectron.handleWheel),
  'QuickPick.selectCurrentIndex': Viewlet.wrapViewletCommand(ViewletQuickPickElectron.name, ViewletQuickPickElectron.selectCurrentIndex),
  'QuickPick.selectIndex': Viewlet.wrapViewletCommand(ViewletQuickPickElectron.name, ViewletQuickPickElectron.selectIndex),
  'QuickPick.selectItem': Viewlet.wrapViewletCommand(ViewletQuickPickElectron.name, ViewletQuickPickElectron.selectItem),
}

export * from './ViewletQuickPickElectron.js'
