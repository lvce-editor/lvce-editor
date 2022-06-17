import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletStatusBar from './ViewletStatusBar.js'

export const __initialize__ = () => {
  Command.register(2260, Viewlet.wrapViewletCommand('StatusBar', ViewletStatusBar.updateStatusBarItems))
}
