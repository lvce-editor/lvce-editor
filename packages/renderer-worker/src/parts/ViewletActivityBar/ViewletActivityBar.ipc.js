import * as ViewletActivityBar from './ViewletActivityBar.js'
import * as LazyCommand from '../LazyCommand/LazyCommand.js'

const Imports = {
  Focus: () => import('./ViewletActivityBarFocus.js'),
  FocusFirst: () => import('./ViewletActivityBarFocusFirst.js'),
  FocusIndex: () => import('./ViewletActivityBarFocusIndex.js'),
  FocusLast: () => import('./ViewletActivityBarFocusLast.js'),
  FocusNext: () => import('./ViewletActivityBarFocusNext.js'),
  FocusPrevious: () => import('./ViewletActivityBarFocusPrevious.js'),
  SelectCurrent: () => import('./ViewletActivityBarSelectCurrent.js'),
  HandleClick: () => import('./ViewletActivityBarHandleClick.js'),
}

// prettier-ignore
export const Commands = {
  focus: LazyCommand.create(ViewletActivityBar.name, Imports.Focus, 'focus'),
  focusFirst: LazyCommand.create(ViewletActivityBar.name, Imports.FocusFirst, 'focusFirst'),
  focusLast: LazyCommand.create(ViewletActivityBar.name, Imports.FocusLast, 'focusLast'),
  focusNext: LazyCommand.create(ViewletActivityBar.name, Imports.FocusNext, 'focusNext'),
  focusPrevious: LazyCommand.create(ViewletActivityBar.name, Imports.FocusPrevious, 'focusPrevious'),
  getHiddenItems: ViewletActivityBar.getHiddenItems,
  handleBlur:  ViewletActivityBar.handleBlur,
  handleClick: LazyCommand.create(ViewletActivityBar.name, Imports.HandleClick, 'handleClick'),
  handleContextMenu:  ViewletActivityBar.handleContextMenu,
  handleSideBarHidden: ViewletActivityBar.handleSideBarHidden,
  handleSideBarViewletChange: ViewletActivityBar.handleSideBarViewletChange,
  selectCurrent: LazyCommand.create(ViewletActivityBar.name,Imports.SelectCurrent, 'selectCurrent'),
  toggleItem: ViewletActivityBar.toggleItem,
  updateSourceControlCount:  ViewletActivityBar.updateSourceControlCount,
}

export const Events = {
  'SourceControl.changeBadgeCount': ViewletActivityBar.updateSourceControlCount,
  'Layout.hideSideBar': ViewletActivityBar.handleSideBarHidden,
  'SideBar.viewletChange': ViewletActivityBar.handleSideBarViewletChange,
}

export const Css = '/css/parts/ViewletActivityBar.css'

export * from './ViewletActivityBar.js'
