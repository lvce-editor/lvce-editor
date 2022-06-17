import * as Command from '../Command/Command.js'
import * as QuickPick from './QuickPick.js'

export const __initialize__ = () => {
  Command.register(71179, QuickPick.openEverythingQuickPick)
  Command.register(71178, QuickPick.dispose)
  Command.register(71180, QuickPick.selectCurrentIndex)
  Command.register(71181, QuickPick.handleInput)
  Command.register(71182, QuickPick.selectIndex)
  // TODO should this be inside quickpick?
  Command.register(7611, QuickPick.openCommandPalette)
  Command.register(7612, QuickPick.openView)
  Command.register(18920, QuickPick.focusFirst)
  Command.register(18921, QuickPick.focusLast)
  Command.register(18922, QuickPick.focusPrevious)
  Command.register(18923, QuickPick.focusNext)
  Command.register(18924, QuickPick.openGoToLine)
  Command.register(18925, QuickPick.openColorTheme)
  Command.register(18926, QuickPick.fileOpenRecent)
  Command.register(18927, QuickPick.handleBlur)
  Command.register(18928, QuickPick.showExtensionsQuickPick)
}
