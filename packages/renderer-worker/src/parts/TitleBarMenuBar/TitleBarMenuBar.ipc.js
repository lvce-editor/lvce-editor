import * as TitleBarMenuBar from './TitleBarMenuBar.js'
import * as MenuIpc from '../Menu/Menu.ipc.js'

// prettier-ignore
export const Commands = {
  'TitleBarMenuBar.closeMenu': TitleBarMenuBar.closeMenu,
  'TitleBarMenuBar.focus': TitleBarMenuBar.focus,
  'TitleBarMenuBar.focusIndex': TitleBarMenuBar.focusIndex,
  'TitleBarMenuBar.focusNext': TitleBarMenuBar.focusNext,
  'TitleBarMenuBar.focusPrevious': TitleBarMenuBar.focusPrevious,
  'TitleBarMenuBar.handleKeyArrowDown': TitleBarMenuBar.handleKeyArrowDown,
  'TitleBarMenuBar.handleKeyArrowLeft': TitleBarMenuBar.handleKeyArrowLeft,
  'TitleBarMenuBar.handleKeyArrowRight': TitleBarMenuBar.handleKeyArrowRight,
  'TitleBarMenuBar.handleKeyArrowUp': TitleBarMenuBar.handleKeyArrowUp,
  'TitleBarMenuBar.handleKeyEnd': TitleBarMenuBar.handleKeyEnd,
  'TitleBarMenuBar.handleKeyEnter': TitleBarMenuBar.handleKeyEnter,
  'TitleBarMenuBar.handleKeyEscape': TitleBarMenuBar.handleKeyEscape,
  'TitleBarMenuBar.handleKeyHome': TitleBarMenuBar.handleKeyHome,
  'TitleBarMenuBar.handleKeySpace': TitleBarMenuBar.handleKeySpace,
  'TitleBarMenuBar.hydrate': TitleBarMenuBar.hydrate,
  'TitleBarMenuBar.openMenu': TitleBarMenuBar.openMenu,
  'TitleBarMenuBar.toggleIndex': TitleBarMenuBar.toggleIndex,
  ...MenuIpc.Commands,
}
