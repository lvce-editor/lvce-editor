import * as Command from '../Command/Command.js'
import * as Menu from './Menu.js'

export const __initialize__ = () => {
  Command.register(7900, Menu.showControlled)
  Command.register(7901, Menu.hide)
  Command.register(7902, Menu.focusIndex)
  Command.register(7903, Menu.showSubMenu)
  Command.register(7904, Menu.hideSubMenu)
  Command.register(7905, Menu.showMenu)
  Command.register(7906, Menu.showContextMenu)

}
