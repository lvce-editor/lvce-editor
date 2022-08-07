import * as ViewletQuickPick from './ViewletQuickPick.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

// prettier-ignore
export const Commands = {
  'QuickPick.openEverythingQuickPick': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.openEverythingQuickPick),
  'QuickPick.dispose': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.dispose),
  'QuickPick.hide': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.dispose),
  'QuickPick.selectCurrentIndex': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.selectCurrentIndex),
  'QuickPick.handleInput': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.handleInput),
  'QuickPick.selectIndex': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.selectIndex),
  'QuickPick.openCommandPalette': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.openCommandPalette),
  'QuickPick.openView': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.openView),
  'QuickPick.focusFirst': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.focusFirst),
  'QuickPick.focusLast': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.focusLast),
  'QuickPick.focusPrevious': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.focusPrevious),
  'QuickPick.focusNext': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.focusNext),
  'QuickPick.openGoToLine': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.openGoToLine),
  'QuickPick.openColorTheme': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.openColorTheme),
  'QuickPick.fileOpenRecent': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.fileOpenRecent),
  'QuickPick.handleBlur': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.handleBlur),
  'QuickPick.showExtensionsQuickPick': Viewlet.wrapViewletCommand('QuickPick', ViewletQuickPick.showExtensionsQuickPick),
}

export * from './ViewletQuickPick.js'
