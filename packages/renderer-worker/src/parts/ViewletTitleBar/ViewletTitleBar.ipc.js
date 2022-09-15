import * as ViewletTitleBar from './ViewletTitleBar.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

// prettier-ignore
export const Commands = {
  'TitleBar.handleTitleBarButtonsClick': Viewlet.wrapViewletCommand('TitleBar', ViewletTitleBar.handleTitleBarButtonsClick),
}

export * from './ViewletTitleBar.js'
