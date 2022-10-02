import * as ViewletTitleBarMenuBar from './ViewletTitleBarMenuBar.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

// prettier-ignore
export const Commands = {
  'TitleBarMenuBar.closeMenu': Viewlet.wrapViewletCommand('TitleBarMenuBar', ViewletTitleBarMenuBar.closeMenu),
  'TitleBarMenuBar.focus': Viewlet.wrapViewletCommand('TitleBarMenuBar', ViewletTitleBarMenuBar.focus),
  'TitleBarMenuBar.focusFirst': Viewlet.wrapViewletCommand('TitleBarMenuBar', ViewletTitleBarMenuBar.focusFirst),
  'TitleBarMenuBar.focusIndex': Viewlet.wrapViewletCommand('TitleBarMenuBar', ViewletTitleBarMenuBar.focusIndex),
  'TitleBarMenuBar.focusLast': Viewlet.wrapViewletCommand('TitleBarMenuBar', ViewletTitleBarMenuBar.focusLast),
  'TitleBarMenuBar.focusNext': Viewlet.wrapViewletCommand('TitleBarMenuBar', ViewletTitleBarMenuBar.focusNext),
  'TitleBarMenuBar.focusPrevious': Viewlet.wrapViewletCommand('TitleBarMenuBar', ViewletTitleBarMenuBar.focusPrevious),
  'TitleBarMenuBar.handleKeyArrowDown': Viewlet.wrapViewletCommand('TitleBarMenuBar', ViewletTitleBarMenuBar.handleKeyArrowDown),
  'TitleBarMenuBar.handleKeyArrowLeft': Viewlet.wrapViewletCommand('TitleBarMenuBar', ViewletTitleBarMenuBar.handleKeyArrowLeft),
  'TitleBarMenuBar.handleKeyArrowRight': Viewlet.wrapViewletCommand('TitleBarMenuBar', ViewletTitleBarMenuBar.handleKeyArrowRight),
  'TitleBarMenuBar.handleKeyArrowUp': Viewlet.wrapViewletCommand('TitleBarMenuBar', ViewletTitleBarMenuBar.handleKeyArrowUp),
  'TitleBarMenuBar.handleKeyEnd': Viewlet.wrapViewletCommand('TitleBarMenuBar', ViewletTitleBarMenuBar.handleKeyEnd),
  'TitleBarMenuBar.handleKeyEnter': Viewlet.wrapViewletCommand('TitleBarMenuBar', ViewletTitleBarMenuBar.handleKeyEnter),
  'TitleBarMenuBar.handleKeyEscape': Viewlet.wrapViewletCommand('TitleBarMenuBar', ViewletTitleBarMenuBar.handleKeyEscape),
  'TitleBarMenuBar.handleKeyHome': Viewlet.wrapViewletCommand('TitleBarMenuBar', ViewletTitleBarMenuBar.handleKeyHome),
  'TitleBarMenuBar.handleKeySpace': Viewlet.wrapViewletCommand('TitleBarMenuBar', ViewletTitleBarMenuBar.handleKeySpace),
  'TitleBarMenuBar.handleMouseOver': Viewlet.wrapViewletCommand('TitleBarMenuBar', ViewletTitleBarMenuBar.handleMouseOver),
  'TitleBarMenuBar.toggleIndex': Viewlet.wrapViewletCommand('TitleBarMenuBar', ViewletTitleBarMenuBar.toggleIndex),
  'TitleBarMenuBar.toggleMenu': Viewlet.wrapViewletCommand('TitleBarMenuBar', ViewletTitleBarMenuBar.toggleMenu),
  'TitleBarMenuBar.handleMenuMouseOver': Viewlet.wrapViewletCommand('TitleBarMenuBar', ViewletTitleBarMenuBar.handleMenuMouseOver),
}

export * from './ViewletTitleBarMenuBar.js'
