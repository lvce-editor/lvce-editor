import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletSideBar from './ViewletSideBar.js'

// prettier-ignore
export const Commands =  {
  'SideBar.focus': Viewlet.wrapViewletCommand(ViewletSideBar.name, ViewletSideBar.focus),
  'SideBar.openViewlet': Viewlet.wrapViewletCommand(ViewletSideBar.name, ViewletSideBar.openViewlet),
  'SideBar.show': Viewlet.wrapViewletCommand(ViewletSideBar.name, ViewletSideBar.openViewlet),
  'SideBar.showOrHideViewlet': Viewlet.wrapViewletCommand(ViewletSideBar.name, ViewletSideBar.showOrHideViewlet),
}

export * from './ViewletSideBar.js'
