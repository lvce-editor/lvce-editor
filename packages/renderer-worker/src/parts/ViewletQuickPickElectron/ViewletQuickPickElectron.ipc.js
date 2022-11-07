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
  focusFirst: LazyCommand.create(ViewletQuickPickElectron.name, Imports.FocusFirst, 'focusFirst'),
  focusIndex: LazyCommand.create(ViewletQuickPickElectron.name, Imports.FocusIndex, 'focusIndex'),
  focusLast: LazyCommand.create(ViewletQuickPickElectron.name, Imports.FocusLast, 'focusLast'),
  focusNext: LazyCommand.create(ViewletQuickPickElectron.name, Imports.FocusNext, 'focusNext'),
  focusPrevious: LazyCommand.create(ViewletQuickPickElectron.name, Imports.FocusPrevious, 'focusPrevious'),
  handleBeforeInput: Viewlet.wrapViewletCommand(ViewletQuickPickElectron.name, ViewletQuickPickElectron.handleBeforeInput),
  handleBlur: Viewlet.wrapViewletCommand(ViewletQuickPickElectron.name, ViewletQuickPickElectron.handleBlur),
  handleClickAt: Viewlet.wrapViewletCommand(ViewletQuickPickElectron.name, ViewletQuickPickElectron.handleClickAt),
  handleInput: Viewlet.wrapViewletCommand(ViewletQuickPickElectron.name, ViewletQuickPickElectron.handleInput),
  handleWheel: Viewlet.wrapViewletCommand(ViewletQuickPickElectron.name, ViewletQuickPickElectron.handleWheel),
  selectCurrentIndex: Viewlet.wrapViewletCommand(ViewletQuickPickElectron.name, ViewletQuickPickElectron.selectCurrentIndex),
  selectIndex: Viewlet.wrapViewletCommand(ViewletQuickPickElectron.name, ViewletQuickPickElectron.selectIndex),
  selectItem: Viewlet.wrapViewletCommand(ViewletQuickPickElectron.name, ViewletQuickPickElectron.selectItem),
}

export * from './ViewletQuickPickElectron.js'
