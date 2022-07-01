import * as Command from '../Command/Command.js'
import * as ContextMenu from './ContextMenu.js'

export const __initialize__ = () => {
  Command.register('ContextMenu.select', ContextMenu.select)
  Command.register('ContextMenu.show', ContextMenu.show)
  Command.register('ContextMenu.hide', ContextMenu.hide)
  Command.register('ContextMenu.focusFirst', ContextMenu.focusFirst)
  Command.register('ContextMenu.focusLast', ContextMenu.focusLast)
  Command.register('ContextMenu.focusNext', ContextMenu.focusNext)
  Command.register('ContextMenu.focusPrevious', ContextMenu.focusPrevious)
  Command.register('ContextMenu.selectCurrent', ContextMenu.selectCurrent)
  Command.register('ContextMenu.noop', ContextMenu.noop)
}
