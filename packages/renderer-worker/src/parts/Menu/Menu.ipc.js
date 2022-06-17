import * as Command from '../Command/Command.js'
import * as Menu from './Menu.js'

export const __initialize__ = () => {
  Command.register(7400, Menu.show)
  Command.register(7401, Menu.hide)
  Command.register(7403, Menu.selectIndex)
  Command.register(7404, Menu.focusNext)
  Command.register(7405, Menu.focusPrevious)
  Command.register(7406, Menu.focusFirst)
  Command.register(7407, Menu.focusLast)
  Command.register(7408, Menu.focusIndex)
  Command.register(7409, Menu.handleMouseEnter)
}
