import * as Viewlet from '../Viewlet/Viewlet.js'
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
  'ActivityBar.focus': LazyCommand.create(ViewletActivityBar.name, Imports.Focus, 'focus'),
  'ActivityBar.focusFirst': LazyCommand.create(ViewletActivityBar.name, Imports.FocusFirst, 'focusFirst'),
  'ActivityBar.focusLast': LazyCommand.create(ViewletActivityBar.name, Imports.FocusLast, 'focusLast'),
  'ActivityBar.focusNext': LazyCommand.create(ViewletActivityBar.name, Imports.FocusNext, 'focusNext'),
  'ActivityBar.focusPrevious': LazyCommand.create(ViewletActivityBar.name, Imports.FocusPrevious, 'focusPrevious'),
  'ActivityBar.getHiddenItems': Viewlet.wrapViewletCommand(ViewletActivityBar.name, ViewletActivityBar.getHiddenItems),
  'ActivityBar.handleClick': LazyCommand.create(ViewletActivityBar.name, Imports.HandleClick, 'handleClick'),
  'ActivityBar.handleContextMenu': Viewlet.wrapViewletCommand(ViewletActivityBar.name, ViewletActivityBar.handleContextMenu),
  'ActivityBar.handleSideBarHidden': Viewlet.wrapViewletCommand(ViewletActivityBar.name, ViewletActivityBar.handleSideBarHidden),
  'ActivityBar.handleSideBarViewletChange': Viewlet.wrapViewletCommand(ViewletActivityBar.name, ViewletActivityBar.handleSideBarViewletChange),
  'ActivityBar.selectCurrent': LazyCommand.create(ViewletActivityBar.name,Imports.SelectCurrent, 'selectCurrent'),
  'ActivityBar.toggleItem': Viewlet.wrapViewletCommand(ViewletActivityBar.name, ViewletActivityBar.toggleItem),
  'ActivityBar.updateSourceControlCount': Viewlet.wrapViewletCommand(ViewletActivityBar.name, ViewletActivityBar.updateSourceControlCount),
}

export * from './ViewletActivityBar.js'
