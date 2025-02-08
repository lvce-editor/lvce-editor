import * as TitleBarWorker from '../TitleBarWorker/TitleBarWorker.js'
import * as WrapTextSearchCommand from './WrapTitleBarMenuBarCommand.js'
import * as ViewletTitleBarMenuBar from './ViewletTitleBarMenuBar.js'

export const Commands = {}

export const getCommands = async () => {
  const commands = await TitleBarWorker.invoke('TitleBarMenuBar.getCommands')
  for (const command of commands) {
    Commands[command] = WrapTextSearchCommand.wrapTitleBarMenuBarCommand(command)
  }

  Commands['hotReload'] = ViewletTitleBarMenuBar.hotReload
  return Commands
}

export const saveState = (state) => {
  return TitleBarWorker.invoke(`TitleBarMenuBar.saveState`, state.uid)
}

// export const LazyCommands = {
//   closeMenu: () => import('./ViewletTitleBarMenuBarCloseMenu.js'),
//   focus: () => import('./ViewletTitleBarMenuBarFocus.js'),
//   focusFirst: () => import('./ViewletTitleBarMenuBarFocusFirst.js'),
//   focusIndex: () => import('./ViewletTitleBarMenuBarFocusLast.js'),
//   focusLast: () => import('./ViewletTitleBarMenuBarFocusIndex.js'),
//   focusNext: () => import('./ViewletTitleBarMenuBarFocusNext.js'),
//   focusPrevious: () => import('./ViewletTitleBarMenuBarFocusPrevious.js'),
//   handleKeyArrowDown: () => import('./ViewletTitleBarMenuBarHandleKeyArrowDown.js'),
//   handleKeyArrowLeft: () => import('./ViewletTitleBarMenuBarHandleKeyArrowLeft.js'),
//   handleKeyArrowRight: () => import('./ViewletTitleBarMenuBarHandleKeyArrowRight.js'),
//   handleKeyArrowUp: () => import('./ViewletTitleBarMenuBarHandleKeyArrowUp.js'),
//   handleKeyEnd: () => import('./ViewletTitleBarMenuBarHandleKeyEnd.js'),
//   handleKeyEnter: () => import('./ViewletTitleBarMenuBarHandleKeyEnter.js'),
//   handleKeyEscape: () => import('./ViewletTitleBarMenuBarHandleKeyEscape.js'),
//   handleKeyHome: () => import('./ViewletTitleBarMenuBarHandleKeyHome.js'),
//   handleKeySpace: () => import('./ViewletTitleBarMenuBarHandleKeySpace.js'),
//   handleMenuClick: () => import('./ViewletTitleBarMenuBarHandleMenuClick.js'),
//   handleMenuMouseOver: () => import('./ViewletTitleBarMenuBarHandleMenuMouseOver.js'),
//   handleMouseOver: () => import('./ViewletTitleBarMenuBarHandleMouseOver.js'),
//   handleMouseOut: () => import('./ViewletTitleBarMenuBarHandleMouseOut.js'),
//   toggleIndex: () => import('./ViewletTitleBarMenuBarToggleIndex.js'),
//   toggleMenu: () => import('./ViewletTitleBarMenuBarToggleMenu.js'),
//   handleClick: () => import('./ViewletTitleBarMenuBarHandleClick.js'),
//   handleFocus: () => import('./ViewletTitleBarMenuBarHandleFocus.js'),
// }
