import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ActivityBar from './ViewletActivityBar.js'
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
  'ActivityBar.focus': LazyCommand.create('ActivityBar', Imports.Focus, 'focus'),
  'ActivityBar.focusFirst': LazyCommand.create('ActivityBar', Imports.FocusFirst, 'focusFirst'),
  'ActivityBar.focusLast': LazyCommand.create('ActivityBar', Imports.FocusLast, 'focusLast'),
  'ActivityBar.focusNext': LazyCommand.create('ActivityBar', Imports.FocusNext, 'focusNext'),
  'ActivityBar.focusPrevious': LazyCommand.create('ActivityBar', Imports.FocusPrevious, 'focusPrevious'),
  'ActivityBar.getHiddenItems': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.getHiddenItems),
  'ActivityBar.handleClick': LazyCommand.create('ActivityBar', Imports.HandleClick, 'handleClick'),
  'ActivityBar.handleContextMenu': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.handleContextMenu),
  'ActivityBar.handleSideBarHidden': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.handleSideBarHidden),
  'ActivityBar.handleSideBarViewletChange': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.handleSideBarViewletChange),
  'ActivityBar.selectCurrent': LazyCommand.create('ActivityBar',Imports.SelectCurrent, 'selectCurrent'),
  'ActivityBar.toggleItem': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.toggleItem),
  'ActivityBar.updateSourceControlCount': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.updateSourceControlCount),
}

export * from './ViewletActivityBar.js'
