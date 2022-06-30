import * as Command from '../Command/Command.js'
import * as ViewletSideBar from './ViewletSideBar.js'
import * as Viewlet from './Viewlet.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('SideBar.showOrHideViewlet', Viewlet.wrapViewletCommand('SideBar', ViewletSideBar.showOrHideViewlet))
  Command.register('SideBar.openViewlet', Viewlet.wrapViewletCommand('SideBar', ViewletSideBar.openViewlet))
  Command.register('SideBar.show', Viewlet.wrapViewletCommand('SideBar', ViewletSideBar.openViewlet))
}
