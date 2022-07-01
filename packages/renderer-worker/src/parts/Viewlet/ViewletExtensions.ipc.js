import * as Command from '../Command/Command.js'
import * as ViewletExtensions from './ViewletExtensions.js'
import * as Viewlet from './Viewlet.js'

// prettier-ignore
export const __initialize__ = () => {
  Command.register('ViewletExtensions.openSuggest', Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.openSuggest))
  Command.register('ViewletExtensions.closeSuggest', Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.closeSuggest))
  Command.register('ViewletExtensions.toggleSuggest', Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.toggleSuggest))
  Command.register('ViewletExtensions.handleInput', Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleInput))
  Command.register('ViewletExtensions.handleContextMenu', Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleContextMenu))
  Command.register('ViewletExtensions.handleInstall', Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleInstall))
  Command.register('ViewletExtensions.handleUninstall', Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleUninstall))
  Command.register('ViewletExtensions.handleClick', Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleClick))
  Command.register('ViewletExtensions.focusIndex', Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusIndex))
  Command.register('ViewletExtensions.focusFirst', Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusFirst))
  Command.register('ViewletExtensions.focusLast', Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusLast))
  Command.register('ViewletExtensions.focusPrevious', Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusPrevious))
  Command.register('ViewletExtensions.focusNext', Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusNext))
  Command.register('ViewletExtensions.handleWheel', Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleWheel))
  Command.register('ViewletExtensions.focusNextPage', Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusNextPage))
  Command.register('ViewletExtensions.focusPreviousPage', Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusPreviousPage))
  Command.register('ViewletExtensions.setDeltaY', Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.setDeltaY))
  Command.register('ViewletExtensions.handleScrollBarMove', Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleScrollBarMove))
  Command.register('ViewletExtensions.handleScrollBarClick', Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleScrollBarClick))
}
