import * as Command from '../Command/Command.js'
import * as ViewletSideBar from './ViewletSideBar.js'
import * as Viewlet from './Viewlet.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('ViewletSideBar.showOrHideViewlet', Viewlet.wrapViewletCommand('SideBar', ViewletSideBar.showOrHideViewlet))
  Command.register('ViewletSideBar.openViewlet', Viewlet.wrapViewletCommand('SideBar', ViewletSideBar.openViewlet))
}
