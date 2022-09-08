import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletSideBar from './ViewletSideBar.js'

// prettier-ignore
export const Commands =  {
  'SideBar.focus': Viewlet.wrapViewletCommand('SideBar', ViewletSideBar.focus),
  'SideBar.openViewlet': Viewlet.wrapViewletCommand('SideBar', ViewletSideBar.openViewlet),
  'SideBar.show': Viewlet.wrapViewletCommand('SideBar', ViewletSideBar.openViewlet),
  'SideBar.showOrHideViewlet': Viewlet.wrapViewletCommand('SideBar', ViewletSideBar.showOrHideViewlet),
}

export * from './ViewletSideBar.js'
