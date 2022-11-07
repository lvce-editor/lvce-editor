import * as ViewletTitleBarMenuBar from './ViewletTitleBarMenuBar.js'
import * as LazyCommand from '../LazyCommand/LazyCommand.js'

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
  closeMenu: LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.CloseMenu, 'closeMenu'),
  focus: LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.Focus, 'focus'),
  focusFirst: LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.FocusFirst, 'focusFirst'),
  focusIndex: LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.FocusIndex, 'focusIndex'),
  focusLast: LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.FocusLast, 'focusLast'),
  focusNext: LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.FocusNext, 'focusNext'),
  focusPrevious: LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.FocusPrevious, 'focusPrevious'),
  handleKeyArrowDown: LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.HandleKeyArrowDown, 'handleKeyArrowDown'),
  handleKeyArrowLeft: LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.HandleKeyArrowLeft, 'handleKeyArrowLeft'),
  handleKeyArrowRight: LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.HandleKeyArrowRight, 'handleKeyArrowRight'),
  handleKeyArrowUp: LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.HandleKeyArrowUp, 'handleKeyArrowUp'),
  handleKeyEnd: LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.HandleKeyEnd, 'handleKeyEnd'),
  handleKeyEnter: LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.HandleKeyEnter, 'handleKeyEnter'),
  handleKeyEscape: LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.HandleKeyEscape, 'handleKeyEscape'),
  handleKeyHome: LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.HandleKeyHome, 'handleKeyHome'),
  handleKeySpace: LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.HandleKeySpace, 'handleKeySpace'),
  handleMenuMouseDown: LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.HandleMenuMouseDown, 'handleMenuMouseDown'),
  handleMenuMouseOver: LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.HandleMenuMouseOver, 'handleMenuMouseOver'),
  handleMouseOver: LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.HandleMouseOver, 'handleMouseOver'),
  toggleIndex: LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.ToggleIndex, 'toggleIndex'),
  toggleMenu: LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.ToggleMenu, 'toggleMenu'),
}

export const Css = '/css/parts/ViewletTitleBarMenuBar.css'

export * from './ViewletTitleBarMenuBar.js'
