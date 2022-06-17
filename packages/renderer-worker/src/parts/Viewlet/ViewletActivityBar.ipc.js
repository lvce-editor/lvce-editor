import * as Command from '../Command/Command.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ActivityBar from './ViewletActivityBar.js'

export const __initialize__ = () => {
  Command.register(8000, Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.toggleItem))
  Command.register(8001, Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.handleClick))
  Command.register(8002, Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.handleContextMenu))
  Command.register(8003, Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.focus))
  Command.register(8004, Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.focusNext))
  Command.register(8005, Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.focusPrevious))
  Command.register(8006, Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.focusFirst))
  Command.register(8007, Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.focusLast))
  Command.register(8008, Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.selectCurrent))
  Command.register(8010, Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.getItems))
  Command.register(8011, Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.getHiddenItems))
  Command.register(8012, Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.updateSourceControlCount))
  Command.register(8013, Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.handleSideBarViewletChange))
  Command.register(8014, Viewlet.wrapViewletCommand('ActivityBar', ActivityBar.handleSideBarHidden))
}
