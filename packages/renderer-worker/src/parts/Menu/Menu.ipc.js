import * as Command from '../Command/Command.js'
import * as Menu from './Menu.js'

export const __initialize__ = () => {
  Command.register('Menu.show', Menu.show)
  Command.register('Menu.hide', Menu.hide)
  Command.register('Menu.selectIndex', Menu.selectIndex)
  Command.register('Menu.focusNext', Menu.focusNext)
  Command.register('Menu.focusPrevious', Menu.focusPrevious)
  Command.register('Menu.focusFirst', Menu.focusFirst)
  Command.register('Menu.focusLast', Menu.focusLast)
  Command.register('Menu.focusIndex', Menu.focusIndex)
  Command.register('Menu.handleMouseEnter', Menu.handleMouseEnter)
}
