import * as ViewletQuickPick from './ViewletQuickPick.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

// prettier-ignore
export const Commands = {
  'QuickPick.selectCurrentIndex': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.selectCurrentIndex),
  'QuickPick.handleInput': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.handleInput),
  'QuickPick.selectIndex': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.selectIndex),
  'QuickPick.focusFirst': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.focusFirst),
  'QuickPick.focusLast': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.focusLast),
  'QuickPick.focusPrevious': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.focusPrevious),
  'QuickPick.focusNext': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.focusNext),
  'QuickPick.handleBlur': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.handleBlur),
  'QuickPick.handleBeforeInput': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.handleBeforeInput),
}

export * from './ViewletQuickPick.js'
