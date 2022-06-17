import * as Command from '../Command/Command.js'
import * as ViewletExtensions from './ViewletExtensions.js'
import * as Viewlet from './Viewlet.js'

export const __initialize__ = () => {
  Command.register(860, Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.openSuggest))
  Command.register(861, Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.closeSuggest))
  Command.register(862, Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.toggleSuggest))
  Command.register(863, Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleInput))
  Command.register(864, Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleContextMenu))
  Command.register(865, Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleInstall))
  Command.register(866, Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleUninstall))
  Command.register(867, Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleClick))
  Command.register(868, Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusIndex))
  Command.register(869, Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusFirst))
  Command.register(870, Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusLast))
  Command.register(871, Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusPrevious))
  Command.register(872, Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusNext))
  Command.register(873, Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleWheel))
  Command.register(874, Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusNextPage))
  Command.register(875, Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusPreviousPage))
  Command.register(876, Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.setDeltaY))
  Command.register(877, Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleScrollBarMove))
  Command.register(878, Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleScrollBarClick))
}
