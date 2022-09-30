import * as ViewletTitleBarMenuBar from './ViewletTitleBarMenuBar.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

// prettier-ignore
export const Commands = {
  'TitleBarMenuBar.closeMenu': Viewlet.wrapViewletCommand('TitleBarButtons', ViewletTitleBarMenuBar.closeMenu),
  'TitleBarMenuBar.focus': Viewlet.wrapViewletCommand('TitleBarButtons', ViewletTitleBarMenuBar.focus),
  'TitleBarMenuBar.focusFirst': Viewlet.wrapViewletCommand('TitleBarButtons', ViewletTitleBarMenuBar.focusFirst),
  'TitleBarMenuBar.focusIndex': Viewlet.wrapViewletCommand('TitleBarButtons', ViewletTitleBarMenuBar.focusIndex),
  'TitleBarMenuBar.focusLast': Viewlet.wrapViewletCommand('TitleBarButtons', ViewletTitleBarMenuBar.focusLast),
  'TitleBarMenuBar.focusNext': Viewlet.wrapViewletCommand('TitleBarButtons', ViewletTitleBarMenuBar.focusNext),
  'TitleBarMenuBar.focusPrevious': Viewlet.wrapViewletCommand('TitleBarButtons', ViewletTitleBarMenuBar.focusPrevious),
  'TitleBarMenuBar.handleKeyArrowDown': Viewlet.wrapViewletCommand('TitleBarButtons', ViewletTitleBarMenuBar.handleKeyArrowDown),
  'TitleBarMenuBar.handleKeyArrowLeft': Viewlet.wrapViewletCommand('TitleBarButtons', ViewletTitleBarMenuBar.handleKeyArrowLeft),
  'TitleBarMenuBar.handleKeyArrowRight': Viewlet.wrapViewletCommand('TitleBarButtons', ViewletTitleBarMenuBar.handleKeyArrowRight),
  'TitleBarMenuBar.handleKeyArrowUp': Viewlet.wrapViewletCommand('TitleBarButtons', ViewletTitleBarMenuBar.handleKeyArrowUp),
  'TitleBarMenuBar.handleKeyEnd': Viewlet.wrapViewletCommand('TitleBarButtons', ViewletTitleBarMenuBar.handleKeyEnd),
  'TitleBarMenuBar.handleKeyEnter': Viewlet.wrapViewletCommand('TitleBarButtons', ViewletTitleBarMenuBar.handleKeyEnter),
  'TitleBarMenuBar.handleKeyEscape': Viewlet.wrapViewletCommand('TitleBarButtons', ViewletTitleBarMenuBar.handleKeyEscape),
  'TitleBarMenuBar.handleKeyHome': Viewlet.wrapViewletCommand('TitleBarButtons', ViewletTitleBarMenuBar.handleKeyHome),
  'TitleBarMenuBar.handleKeySpace': Viewlet.wrapViewletCommand('TitleBarButtons', ViewletTitleBarMenuBar.handleKeySpace),
  'TitleBarMenuBar.toggleIndex': Viewlet.wrapViewletCommand('TitleBarButtons', ViewletTitleBarMenuBar.toggleIndex),
  'TitleBarMenuBar.toggleMenu': Viewlet.wrapViewletCommand('TitleBarButtons', ViewletTitleBarMenuBar.toggleMenu),
}

export * from './ViewletTitleBarMenuBar.js'
