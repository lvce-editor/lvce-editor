import * as ViewletTitleBarButtons from './ViewletTitleBarButtons.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

// prettier-ignore
export const Commands = {
  'TitleBarButtons.handleClickClose': Viewlet.wrapViewletCommand('TitleBarButtons', ViewletTitleBarButtons.handleClickClose),
  'TitleBarButtons.handleClickMinimize': Viewlet.wrapViewletCommand('TitleBarButtons', ViewletTitleBarButtons.handleClickMinimize),
  'TitleBarButtons.handleClickToggleMaximize': Viewlet.wrapViewletCommand('TitleBarButtons', ViewletTitleBarButtons.handleClickToggleMaximize),
}

export * from './ViewletTitleBarButtons.js'
