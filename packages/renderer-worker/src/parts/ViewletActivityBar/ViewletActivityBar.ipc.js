import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ActivityBar from './ViewletActivityBar.js'

// prettier-ignore
export const Commands = {
  'ActivityBar.toggleItem': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.toggleItem),
  'ActivityBar.handleClick': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.handleClick),
  'ActivityBar.handleContextMenu': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.handleContextMenu),
  'ActivityBar.focus': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.focus),
  'ActivityBar.focusNext': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.focusNext),
  'ActivityBar.focusPrevious': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.focusPrevious),
  'ActivityBar.focusFirst': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.focusFirst),
  'ActivityBar.focusLast': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.focusLast),
  'ActivityBar.selectCurrent': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.selectCurrent),
  'ActivityBar.getItems': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.getItems),
  'ActivityBar.getHiddenItems': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.getHiddenItems),
  'ActivityBar.updateSourceControlCount': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.updateSourceControlCount),
  'ActivityBar.handleSideBarViewletChange': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.handleSideBarViewletChange),
  'ActivityBar.handleSideBarHidden': Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.handleSideBarHidden),
}

export const Css = '/css/parts/ActivityBar.css'

export * from './ViewletActivityBar.js'
