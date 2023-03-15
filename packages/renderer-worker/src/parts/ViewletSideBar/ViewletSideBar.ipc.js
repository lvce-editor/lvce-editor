import * as ViewletSideBar from './ViewletSideBar.js'

export const name = 'SideBar'

// prettier-ignore
export const Commands =  {
  focus: ViewletSideBar.focus,
  openViewlet: ViewletSideBar.openViewlet,
  show: ViewletSideBar.openViewlet,
}

export * from './ViewletSideBarCss.js'
export * from './ViewletSideBar.js'
