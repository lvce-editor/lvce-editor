import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ActivityBar from './ViewletActivityBar.js'

// prettier-ignore
export const Commands = {
  'ActivityBar.focus': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.focus),
  'ActivityBar.focusFirst': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.focusFirst),
  'ActivityBar.focusLast': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.focusLast),
  'ActivityBar.focusNext': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.focusNext),
  'ActivityBar.focusPrevious': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.focusPrevious),
  'ActivityBar.getHiddenItems': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.getHiddenItems),
  'ActivityBar.getItems': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.getItems),
  'ActivityBar.handleClick': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.handleClick),
  'ActivityBar.handleContextMenu': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.handleContextMenu),
  'ActivityBar.handleSideBarHidden': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.handleSideBarHidden),
  'ActivityBar.handleSideBarViewletChange': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.handleSideBarViewletChange),
  'ActivityBar.selectCurrent': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.selectCurrent),
  'ActivityBar.toggleItem': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.toggleItem),
  'ActivityBar.updateSourceControlCount': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.updateSourceControlCount),
}

export * from './ViewletActivityBar.js'
