import * as Viewlet from './Viewlet.js'
import * as ViewletExtensions from './ViewletExtensions.js'

// prettier-ignore
export const Commands = {
  'ViewletExtensions.openSuggest': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.openSuggest),
  'ViewletExtensions.closeSuggest': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.closeSuggest),
  'ViewletExtensions.toggleSuggest': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.toggleSuggest),
  'ViewletExtensions.handleInput': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleInput),
  'ViewletExtensions.handleContextMenu': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleContextMenu),
  'ViewletExtensions.handleInstall': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleInstall),
  'ViewletExtensions.handleUninstall': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleUninstall),
  'ViewletExtensions.handleClick': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleClick),
  'ViewletExtensions.focusIndex': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusIndex),
  'ViewletExtensions.focusFirst': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusFirst),
  'ViewletExtensions.focusLast': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusLast),
  'ViewletExtensions.focusPrevious': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusPrevious),
  'ViewletExtensions.focusNext': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusNext),
  'ViewletExtensions.handleWheel': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleWheel),
  'ViewletExtensions.focusNextPage': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusNextPage),
  'ViewletExtensions.focusPreviousPage': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusPreviousPage),
  'ViewletExtensions.setDeltaY': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.setDeltaY),
  'ViewletExtensions.handleScrollBarMove': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleScrollBarMove),
  'ViewletExtensions.handleScrollBarClick': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleScrollBarClick),
}

export * from './ViewletExtensions.js'
