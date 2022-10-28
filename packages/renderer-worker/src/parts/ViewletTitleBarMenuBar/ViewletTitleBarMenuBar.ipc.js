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
  'TitleBarMenuBar.closeMenu': LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.CloseMenu, 'closeMenu'),
  'TitleBarMenuBar.focus': LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.Focus, 'focus'),
  'TitleBarMenuBar.focusFirst': LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.FocusFirst, 'focusFirst'),
  'TitleBarMenuBar.focusIndex': LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.FocusIndex, 'focusIndex'),
  'TitleBarMenuBar.focusLast': LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.FocusLast, 'focusLast'),
  'TitleBarMenuBar.focusNext': LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.FocusNext, 'focusNext'),
  'TitleBarMenuBar.focusPrevious': LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.FocusPrevious, 'focusPrevious'),
  'TitleBarMenuBar.handleKeyArrowDown': LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.HandleKeyArrowDown, 'handleKeyArrowDown'),
  'TitleBarMenuBar.handleKeyArrowLeft': LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.HandleKeyArrowLeft, 'handleKeyArrowLeft'),
  'TitleBarMenuBar.handleKeyArrowRight': LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.HandleKeyArrowRight, 'handleKeyArrowRight'),
  'TitleBarMenuBar.handleKeyArrowUp': LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.HandleKeyArrowUp, 'handleKeyArrowUp'),
  'TitleBarMenuBar.handleKeyEnd': LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.HandleKeyEnd, 'handleKeyEnd'),
  'TitleBarMenuBar.handleKeyEnter': LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.HandleKeyEnter, 'handleKeyEnter'),
  'TitleBarMenuBar.handleKeyEscape': LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.HandleKeyEscape, 'handleKeyEscape'),
  'TitleBarMenuBar.handleKeyHome': LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.HandleKeyHome, 'handleKeyHome'),
  'TitleBarMenuBar.handleKeySpace': LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.HandleKeySpace, 'handleKeySpace'),
  'TitleBarMenuBar.handleMenuMouseDown': LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.HandleMenuMouseDown, 'handleMenuMouseDown'),
  'TitleBarMenuBar.handleMenuMouseOver': LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.HandleMenuMouseOver, 'handleMenuMouseOver'),
  'TitleBarMenuBar.handleMouseOver': LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.HandleMouseOver, 'handleMouseOver'),
  'TitleBarMenuBar.toggleIndex': LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.ToggleIndex, 'toggleIndex'),
  'TitleBarMenuBar.toggleMenu': LazyCommand.create(ViewletTitleBarMenuBar.name, Imports.ToggleMenu, 'toggleMenu'),
}

export const Css = '/css/parts/ViewletTitleBarMenuBar.css'

export * from './ViewletTitleBarMenuBar.js'
