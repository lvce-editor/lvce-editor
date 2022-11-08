import * as ViewletActivityBar from './ViewletActivityBar.js'

// prettier-ignore
export const Commands = {
  getHiddenItems: ViewletActivityBar.getHiddenItems,
  handleBlur:  ViewletActivityBar.handleBlur,
  handleContextMenu:  ViewletActivityBar.handleContextMenu,
  handleSideBarHidden: ViewletActivityBar.handleSideBarHidden,
  handleSideBarViewletChange: ViewletActivityBar.handleSideBarViewletChange,
  toggleItem: ViewletActivityBar.toggleItem,
  updateSourceControlCount:  ViewletActivityBar.updateSourceControlCount,
}

// prettier-ignore
export const LazyCommands={
  focus: () => import('./ViewletActivityBarFocus.js'),
  focusFirst: () => import('./ViewletActivityBarFocusFirst.js'),
  focusIndex: () => import('./ViewletActivityBarFocusIndex.js'),
  focusLast: () => import('./ViewletActivityBarFocusLast.js'),
  focusNext: () => import('./ViewletActivityBarFocusNext.js'),
  focusPrevious: () => import('./ViewletActivityBarFocusPrevious.js'),
  selectCurrent: () => import('./ViewletActivityBarSelectCurrent.js'),
  handleClick: () => import('./ViewletActivityBarHandleClick.js'),
}

export const Events = {
  'SourceControl.changeBadgeCount': ViewletActivityBar.updateSourceControlCount,
  'Layout.hideSideBar': ViewletActivityBar.handleSideBarHidden,
  'SideBar.viewletChange': ViewletActivityBar.handleSideBarViewletChange,
}

export const Css = '/css/parts/ViewletActivityBar.css'

export * from './ViewletActivityBar.js'
