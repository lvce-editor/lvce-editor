export const name = 'TitleBarMenuBar'

// prettier-ignore
export const LazyCommands={
  closeMenu: () => import('./ViewletTitleBarMenuBarCloseMenu.js'),
  focus: () => import('./ViewletTitleBarMenuBarFocus.js'),
  focusFirst: () => import('./ViewletTitleBarMenuBarFocusFirst.js'),
  focusIndex: () => import('./ViewletTitleBarMenuBarFocusLast.js'),
  focusLast: () => import('./ViewletTitleBarMenuBarFocusIndex.js'),
  focusNext: () => import('./ViewletTitleBarMenuBarFocusNext.js'),
  focusPrevious: () => import('./ViewletTitleBarMenuBarFocusPrevious.js'),
  handleKeyArrowDown: () => import('./ViewletTitleBarMenuBarHandleKeyArrowDown.js'),
  handleKeyArrowLeft: () => import('./ViewletTitleBarMenuBarHandleKeyArrowLeft.js'),
  handleKeyArrowRight: () => import('./ViewletTitleBarMenuBarHandleKeyArrowRight.js'),
  handleKeyArrowUp: () => import('./ViewletTitleBarMenuBarHandleKeyArrowUp.js'),
  handleKeyEnd: () => import('./ViewletTitleBarMenuBarHandleKeyEnd.js'),
  handleKeyEnter: () => import('./ViewletTitleBarMenuBarHandleKeyEnter.js'),
  handleKeyEscape: () => import('./ViewletTitleBarMenuBarHandleKeyEscape.js'),
  handleKeyHome: () => import('./ViewletTitleBarMenuBarHandleKeyHome.js'),
  handleKeySpace: () => import('./ViewletTitleBarMenuBarHandleKeySpace.js'),
  handleMenuMouseDown: () => import('./ViewletTitleBarMenuBarHandleMenuMouseDown.js'),
  handleMenuMouseOver: () => import('./ViewletTitleBarMenuBarHandleMenuMouseOver.js'),
  handleMouseOver: () => import('./ViewletTitleBarMenuBarHandleMouseOver.js'),
  toggleIndex: () => import('./ViewletTitleBarMenuBarToggleIndex.js'),
  toggleMenu: () => import('./ViewletTitleBarMenuBarToggleMenu.js'),
}

export const Css = '/css/parts/ViewletTitleBarMenuBar.css'

export * from './ViewletTitleBarMenuBar.js'
