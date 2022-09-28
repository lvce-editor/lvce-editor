import * as ViewletTitleBar from './ViewletTitleBar.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

// prettier-ignore
export const Commands = {
  'TitleBar.handleTitleBarButtonClickMinimize': Viewlet.wrapViewletCommand('TitleBar', ViewletTitleBar.handleTitleBarClickMinimize),
  'TitleBar.handleTitleBarButtonClickToggleMaximize': Viewlet.wrapViewletCommand('TitleBar', ViewletTitleBar.handleTitleBarClickToggleMaximize),
  'TitleBar.handleTitleBarButtonClickClose': Viewlet.wrapViewletCommand('TitleBar', ViewletTitleBar.handleTitleBarClickClose),
}

export * from './ViewletTitleBar.js'
