import * as Command from '../Command/Command.js'
import * as ContextMenu from './ContextMenu.js'

export const __initialize__ = () => {
  Command.register(950, ContextMenu.select)
  Command.register(951, ContextMenu.show)
  Command.register(952, ContextMenu.hide)
  Command.register(953, ContextMenu.focusFirst)
  Command.register(954, ContextMenu.focusLast)
  Command.register(955, ContextMenu.focusNext)
  Command.register(956, ContextMenu.focusPrevious)
  Command.register(957, ContextMenu.selectCurrent)
  Command.register(958, ContextMenu.noop)
}
