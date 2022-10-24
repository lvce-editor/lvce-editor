import * as ViewletSideBar from './ViewletSideBar.js'

// prettier-ignore
export const Commands =  {
  'SideBar.focus': ViewletSideBar.focus,
  'SideBar.openViewlet': ViewletSideBar.openViewlet,
  'SideBar.show': ViewletSideBar.openViewlet,
}

export const Css = '/css/parts/ViewletSideBar.css'

export * from './ViewletSideBar.js'
