import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ActivityBar from './ViewletActivityBar.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('ActivityBar.toggleItem', Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.toggleItem))
  Command.register('ActivityBar.handleClick', Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.handleClick))
  Command.register('ActivityBar.handleContextMenu', Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.handleContextMenu))
  Command.register('ActivityBar.focus', Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.focus))
  Command.register('ActivityBar.focusNext', Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.focusNext))
  Command.register('ActivityBar.focusPrevious', Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.focusPrevious))
  Command.register('ActivityBar.focusFirst', Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.focusFirst))
  Command.register('ActivityBar.focusLast', Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.focusLast))
  Command.register('ActivityBar.selectCurrent', Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.selectCurrent))
  Command.register('ActivityBar.getItems', Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.getItems))
  Command.register('ActivityBar.getHiddenItems', Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.getHiddenItems))
  Command.register('ActivityBar.updateSourceControlCount', Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.updateSourceControlCount))
  Command.register('ActivityBar.handleSideBarViewletChange', Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.handleSideBarViewletChange))
  Command.register('ActivityBar.handleSideBarHidden', Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.handleSideBarHidden))
}
