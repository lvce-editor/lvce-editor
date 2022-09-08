import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletExtensions from './ViewletExtensions.js'

// prettier-ignore
export const Commands = {
  'Extensions.closeSuggest': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.closeSuggest),
  'Extensions.focusFirst': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusFirst),
  'Extensions.focusIndex': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusIndex),
  'Extensions.focusLast': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusLast),
  'Extensions.focusNext': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusNext),
  'Extensions.focusNextPage': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusNextPage),
  'Extensions.focusPrevious': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusPrevious),
  'Extensions.focusPreviousPage': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusPreviousPage),
  'Extensions.handleClick': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleClick),
  'Extensions.handleContextMenu': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleContextMenu),
  'Extensions.handleInput': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleInput),
  'Extensions.handleInstall': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleInstall),
  'Extensions.handleScrollBarClick': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleScrollBarClick),
  'Extensions.handleScrollBarMove': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleScrollBarMove),
  'Extensions.handleUninstall': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleUninstall),
  'Extensions.handleWheel': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleWheel),
  'Extensions.openSuggest': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.openSuggest),
  'Extensions.setDeltaY': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.setDeltaY),
  'Extensions.toggleSuggest': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.toggleSuggest),
}

export * from './ViewletExtensions.js'
