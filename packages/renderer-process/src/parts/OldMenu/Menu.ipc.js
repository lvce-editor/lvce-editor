import * as Command from '../Command/Command.js'
import * as Menu from './Menu.js'

export const __initialize__ = () => {
  Command.register('Menu.showControlled', Menu.showControlled)
  Command.register('Menu.hide', Menu.hide)
  Command.register('Menu.focusIndex', Menu.focusIndex)
  Command.register('Menu.showSubMenu', Menu.showSubMenu)
  Command.register('Menu.hideSubMenu', Menu.hideSubMenu)
  Command.register('Menu.showMenu', Menu.showMenu)
  Command.register('Menu.showContextMenu', Menu.showContextMenu)
}
