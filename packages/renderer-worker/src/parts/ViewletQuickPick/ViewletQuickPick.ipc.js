import * as ViewletQuickPick from './ViewletQuickPick.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

// prettier-ignore
export const Commands = {
  'QuickPick.focusFirst': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.focusFirst),
  'QuickPick.focusIndex': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.focusIndex),
  'QuickPick.focusLast': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.focusLast),
  'QuickPick.focusNext': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.focusNext),
  'QuickPick.focusPrevious': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.focusPrevious),
  'QuickPick.handleBeforeInput': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.handleBeforeInput),
  'QuickPick.handleBlur': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.handleBlur),
  'QuickPick.handleInput': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.handleInput),
  'QuickPick.handleWheel': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.handleWheel),
  'QuickPick.selectCurrentIndex': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.selectCurrentIndex),
  'QuickPick.selectIndex': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.selectIndex),
  'QuickPick.selectItem': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.selectItem),
}

export * from './ViewletQuickPick.js'
