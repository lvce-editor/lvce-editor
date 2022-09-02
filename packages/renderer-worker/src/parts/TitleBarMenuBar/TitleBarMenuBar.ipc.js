import * as TitleBarMenuBar from './TitleBarMenuBar.js'
import * as MenuIpc from '../Menu/Menu.ipc.js'

// prettier-ignore
export const Commands = {
  ...MenuIpc.Commands,

  'TitleBarMenuBar.toggleIndex': TitleBarMenuBar.toggleIndex,
  'TitleBarMenuBar.hydrate': TitleBarMenuBar.hydrate,
  'TitleBarMenuBar.focus': TitleBarMenuBar.focus,
  'TitleBarMenuBar.focusIndex': TitleBarMenuBar.focusIndex,
  'TitleBarMenuBar.focusPrevious': TitleBarMenuBar.focusPrevious,
  'TitleBarMenuBar.focusNext': TitleBarMenuBar.focusNext,
  'TitleBarMenuBar.closeMenu': TitleBarMenuBar.closeMenu,
  'TitleBarMenuBar.openMenu': TitleBarMenuBar.openMenu,
  'TitleBarMenuBar.handleKeyArrowDown': TitleBarMenuBar.handleKeyArrowDown,
  'TitleBarMenuBar.handleKeyArrowUp': TitleBarMenuBar.handleKeyArrowUp,
  'TitleBarMenuBar.handleKeyArrowRight': TitleBarMenuBar.handleKeyArrowRight,
  'TitleBarMenuBar.handleKeyHome': TitleBarMenuBar.handleKeyHome,
  'TitleBarMenuBar.handleKeyEnd': TitleBarMenuBar.handleKeyEnd,
  'TitleBarMenuBar.handleKeySpace': TitleBarMenuBar.handleKeySpace,
  'TitleBarMenuBar.handleKeyEnter': TitleBarMenuBar.handleKeyEnter,
  'TitleBarMenuBar.handleKeyEscape': TitleBarMenuBar.handleKeyEscape,
  'TitleBarMenuBar.handleKeyArrowLeft': TitleBarMenuBar.handleKeyArrowLeft,

}
