import * as Command from '../Command/Command.js'
import * as ViewletSideBar from './ViewletSideBar.js'
import * as Viewlet from './Viewlet.js'

export const __initialize__ = () => {
  Command.register(553, Viewlet.wrapViewletCommand('SideBar', ViewletSideBar.showOrHideViewlet))
  Command.register(554, Viewlet.wrapViewletCommand('SideBar', ViewletSideBar.openViewlet))
}
