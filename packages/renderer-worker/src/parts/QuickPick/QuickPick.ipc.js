import * as Command from '../Command/Command.js'
import * as QuickPick from './QuickPick.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('QuickPick.openEverythingQuickPick', QuickPick.openEverythingQuickPick)
  Command.register('QuickPick.dispose', QuickPick.dispose)
  Command.register('QuickPick.hide', QuickPick.dispose)
  Command.register('QuickPick.selectCurrentIndex', QuickPick.selectCurrentIndex)
  Command.register('QuickPick.handleInput', QuickPick.handleInput)
  Command.register('QuickPick.selectIndex', QuickPick.selectIndex)
  Command.register('QuickPick.openCommandPalette', QuickPick.openCommandPalette)
  Command.register('QuickPick.openView', QuickPick.openView)
  Command.register('QuickPick.focusFirst', QuickPick.focusFirst)
  Command.register('QuickPick.focusLast', QuickPick.focusLast)
  Command.register('QuickPick.focusPrevious', QuickPick.focusPrevious)
  Command.register('QuickPick.focusNext', QuickPick.focusNext)
  Command.register('QuickPick.openGoToLine', QuickPick.openGoToLine)
  Command.register('QuickPick.openColorTheme', QuickPick.openColorTheme)
  Command.register('QuickPick.fileOpenRecent', QuickPick.fileOpenRecent)
  Command.register('QuickPick.handleBlur', QuickPick.handleBlur)
  Command.register('QuickPick.showExtensionsQuickPick', QuickPick.showExtensionsQuickPick)
}
