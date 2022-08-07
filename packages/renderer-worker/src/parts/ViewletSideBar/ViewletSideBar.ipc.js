import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletSideBar from './ViewletSideBar.js'

// prettier-ignore
export const Commands =  {
  'SideBar.showOrHideViewlet': Viewlet.wrapViewletCommand('SideBar', ViewletSideBar.showOrHideViewlet),
  'SideBar.openViewlet': Viewlet.wrapViewletCommand('SideBar', ViewletSideBar.openViewlet),
  'SideBar.show': Viewlet.wrapViewletCommand('SideBar', ViewletSideBar.openViewlet),
}

export const Css = ['/css/parts/SideBar.css']

export * from './ViewletSideBar.js'
