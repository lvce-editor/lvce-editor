import * as Command from '../Command/Command.js'
import * as TitleBarMenuBar from './TitleBarMenuBar.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('TitleBarMenuBar.toggleIndex', TitleBarMenuBar.toggleIndex)
  Command.register('TitleBarMenuBar.hydrate', TitleBarMenuBar.hydrate)
  Command.register('TitleBarMenuBar.focus', TitleBarMenuBar.focus)
  Command.register('TitleBarMenuBar.focusIndex', TitleBarMenuBar.focusIndex)
  Command.register('TitleBarMenuBar.focusPrevious', TitleBarMenuBar.focusPrevious)
  Command.register('TitleBarMenuBar.focusNext', TitleBarMenuBar.focusNext)
  Command.register('TitleBarMenuBar.closeMenu', TitleBarMenuBar.closeMenu)
  Command.register('TitleBarMenuBar.openMenu', TitleBarMenuBar.openMenu)
  Command.register('TitleBarMenuBar.handleKeyArrowDown', TitleBarMenuBar.handleKeyArrowDown)
  Command.register('TitleBarMenuBar.handleKeyArrowUp', TitleBarMenuBar.handleKeyArrowUp)
  Command.register('TitleBarMenuBar.handleKeyArrowRight', TitleBarMenuBar.handleKeyArrowRight)
  Command.register('TitleBarMenuBar.handleKeyHome', TitleBarMenuBar.handleKeyHome)
  Command.register('TitleBarMenuBar.handleKeyEnd', TitleBarMenuBar.handleKeyEnd)
  Command.register('TitleBarMenuBar.handleKeySpace', TitleBarMenuBar.handleKeySpace)
  Command.register('TitleBarMenuBar.handleKeyEnter', TitleBarMenuBar.handleKeyEnter)
  Command.register('TitleBarMenuBar.handleKeyEscape', TitleBarMenuBar.handleKeyEscape)
  Command.register('TitleBarMenuBar.handleKeyArrowLeft', TitleBarMenuBar.handleKeyArrowLeft)
}
