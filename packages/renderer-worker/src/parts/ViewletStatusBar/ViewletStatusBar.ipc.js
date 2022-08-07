import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletStatusBar from './ViewletStatusBar.js'

// prettier-ignore
export const Commands = {
  'ViewletStatusBar.updateStatusBarItems': Viewlet.wrapViewletCommand('StatusBar', ViewletStatusBar.updateStatusBarItems)
}

export * from './ViewletStatusBar.js'
