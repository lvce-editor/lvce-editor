import * as ViewletTitleBarMenuBar from './ViewletTitleBarMenuBar.js'

// prettier-ignore
const Imports = {
  CloseMenu: () => import('./ViewletTitleBarMenuBarCloseMenu.js'),
  Focus: () => import('./ViewletTitleBarMenuBarFocus.js'),
  FocusFirst: () => import('./ViewletTitleBarMenuBarFocusFirst.js'),
  FocusLast: () => import('./ViewletTitleBarMenuBarFocusLast.js'),
  FocusIndex: () => import('./ViewletTitleBarMenuBarFocusIndex.js'),
  FocusNext: () => import('./ViewletTitleBarMenuBarFocusNext.js'),
  FocusPrevious: () => import('./ViewletTitleBarMenuBarFocusPrevious.js'),
  HandleKeyArrowDown: () => import('./ViewletTitleBarMenuBarHandleKeyArrowDown.js'),
  HandleKeyArrowLeft: () => import('./ViewletTitleBarMenuBarHandleKeyArrowLeft.js'),
  HandleKeyArrowRight: () => import('./ViewletTitleBarMenuBarHandleKeyArrowRight.js'),
  HandleKeyArrowUp: () => import('./ViewletTitleBarMenuBarHandleKeyArrowUp.js'),
  HandleKeyEnd: () => import('./ViewletTitleBarMenuBarHandleKeyEnd.js'),
  HandleKeyEnter: () => import('./ViewletTitleBarMenuBarHandleKeyEnter.js'),
  HandleKeyEscape: () => import('./ViewletTitleBarMenuBarHandleKeyEscape.js'),
  HandleKeyHome: () => import('./ViewletTitleBarMenuBarHandleKeyHome.js'),
  HandleKeySpace: () => import('./ViewletTitleBarMenuBarHandleKeySpace.js'),
  HandleMenuMouseDown: () => import('./ViewletTitleBarMenuBarHandleMenuMouseDown.js'),
  HandleMenuMouseOver: () => import('./ViewletTitleBarMenuBarHandleMenuMouseOver.js'),
  HandleMouseOver: () => import('./ViewletTitleBarMenuBarHandleMouseOver.js'),
  ToggleIndex: () => import('./ViewletTitleBarMenuBarToggleIndex.js'),
  ToggleMenu: () => import('./ViewletTitleBarMenuBarToggleMenu.js'),
}

// prettier-ignore
export const Commands = {
  'TitleBarMenuBar.closeMenu': ViewletTitleBarMenuBar.closeMenu,
  'TitleBarMenuBar.focus': ViewletTitleBarMenuBar.focus,
  'TitleBarMenuBar.focusFirst': ViewletTitleBarMenuBar.focusFirst,
  'TitleBarMenuBar.focusIndex': ViewletTitleBarMenuBar.focusIndex,
  'TitleBarMenuBar.focusLast': ViewletTitleBarMenuBar.focusLast,
  'TitleBarMenuBar.focusNext': ViewletTitleBarMenuBar.focusNext,
  'TitleBarMenuBar.focusPrevious': ViewletTitleBarMenuBar.focusPrevious,
  'TitleBarMenuBar.handleKeyArrowDown': ViewletTitleBarMenuBar.handleKeyArrowDown,
  'TitleBarMenuBar.handleKeyArrowLeft': ViewletTitleBarMenuBar.handleKeyArrowLeft,
  'TitleBarMenuBar.handleKeyArrowRight': ViewletTitleBarMenuBar.handleKeyArrowRight,
  'TitleBarMenuBar.handleKeyArrowUp': ViewletTitleBarMenuBar.handleKeyArrowUp,
  'TitleBarMenuBar.handleKeyEnd': ViewletTitleBarMenuBar.handleKeyEnd,
  'TitleBarMenuBar.handleKeyEnter': ViewletTitleBarMenuBar.handleKeyEnter,
  'TitleBarMenuBar.handleKeyEscape': ViewletTitleBarMenuBar.handleKeyEscape,
  'TitleBarMenuBar.handleKeyHome': ViewletTitleBarMenuBar.handleKeyHome,
  'TitleBarMenuBar.handleKeySpace': ViewletTitleBarMenuBar.handleKeySpace,
  'TitleBarMenuBar.handleMenuMouseDown': ViewletTitleBarMenuBar.handleMenuMouseDown,
  'TitleBarMenuBar.handleMenuMouseOver': ViewletTitleBarMenuBar.handleMenuMouseOver,
  'TitleBarMenuBar.handleMouseOver': ViewletTitleBarMenuBar.handleMouseOver,
  'TitleBarMenuBar.toggleIndex': ViewletTitleBarMenuBar.toggleIndex,
  'TitleBarMenuBar.toggleMenu': ViewletTitleBarMenuBar.toggleMenu,
}

export const Css = '/css/parts/ViewletTitleBarMenuBar.css'

export * from './ViewletTitleBarMenuBar.js'
