import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletStatusBar from './ViewletStatusBar.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('ViewletStatusBar.updateStatusBarItems', Viewlet.wrapViewletCommand('StatusBar', ViewletStatusBar.updateStatusBarItems))
}
