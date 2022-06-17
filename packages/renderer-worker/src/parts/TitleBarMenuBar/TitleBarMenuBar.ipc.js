import * as Command from '../Command/Command.js'
import * as TitleBarMenuBar from './TitleBarMenuBar.js'

export const __initialize__ = () => {
  Command.register(4610, TitleBarMenuBar.toggleIndex)
  Command.register(4611, TitleBarMenuBar.hydrate)
  Command.register(4612, TitleBarMenuBar.focus)
  Command.register(4613, TitleBarMenuBar.focusIndex)
  Command.register(4614, TitleBarMenuBar.focusPrevious)
  Command.register(4615, TitleBarMenuBar.focusNext)
  Command.register(4616, TitleBarMenuBar.closeMenu)
  Command.register(4617, TitleBarMenuBar.openMenu)
  Command.register(4618, TitleBarMenuBar.handleKeyArrowDown)
  Command.register(4619, TitleBarMenuBar.handleKeyArrowUp)
  Command.register(4620, TitleBarMenuBar.handleKeyArrowRight)
  Command.register(4621, TitleBarMenuBar.handleKeyHome)
  Command.register(4622, TitleBarMenuBar.handleKeyEnd)
  Command.register(4623, TitleBarMenuBar.handleKeySpace)
  Command.register(4624, TitleBarMenuBar.handleKeyEnter)
  Command.register(4625, TitleBarMenuBar.handleKeyEscape)
  Command.register(4626, TitleBarMenuBar.handleKeyArrowLeft)
}
