import * as ViewletActivityBar from './ViewletActivityBar.ts'

// prettier-ignore
export const Commands = {
  handleBlur: ViewletActivityBar.handleBlur,
  handleSideBarHidden: ViewletActivityBar.handleSideBarHidden,
  handleSideBarViewletChange: ViewletActivityBar.handleSideBarViewletChange,
  toggleItem: ViewletActivityBar.toggleItem,
  updateSourceControlCount: ViewletActivityBar.updateSourceControlCount,
}

// prettier-ignore
export const LazyCommands = {
  focus: () => import('./ViewletActivityBarFocus.js'),
  focusFirst: () => import('./ViewletActivityBarFocusFirst.js'),
  focusIndex: () => import('./ViewletActivityBarFocusIndex.js'),
  focusLast: () => import('./ViewletActivityBarFocusLast.js'),
  focusNext: () => import('./ViewletActivityBarFocusNext.js'),
  focusPrevious: () => import('./ViewletActivityBarFocusPrevious.js'),
  selectCurrent: () => import('./ViewletActivityBarSelectCurrent.js'),
  handleFocus: () => import('./ViewletActivityBarHandleFocus.js'),
  handleClick: () => import('./ViewletActivityBarHandleClick.js'),
  handleContextMenu: () => import('./ViewletActivityBarHandleContextMenu.js'),
  getHiddenItems: () => import('./ViewletActivityBarGetHiddenItems.js')
}
