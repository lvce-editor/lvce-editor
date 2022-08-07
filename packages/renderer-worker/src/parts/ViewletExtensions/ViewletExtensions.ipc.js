import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletExtensions from './ViewletExtensions.js'

// prettier-ignore
export const Commands = {
  'Extensions.openSuggest': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.openSuggest),
  'Extensions.closeSuggest': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.closeSuggest),
  'Extensions.toggleSuggest': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.toggleSuggest),
  'Extensions.handleInput': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleInput),
  'Extensions.handleContextMenu': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleContextMenu),
  'Extensions.handleInstall': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleInstall),
  'Extensions.handleUninstall': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleUninstall),
  'Extensions.handleClick': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleClick),
  'Extensions.focusIndex': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusIndex),
  'Extensions.focusFirst': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusFirst),
  'Extensions.focusLast': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusLast),
  'Extensions.focusPrevious': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusPrevious),
  'Extensions.focusNext': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusNext),
  'Extensions.handleWheel': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleWheel),
  'Extensions.focusNextPage': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusNextPage),
  'Extensions.focusPreviousPage': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.focusPreviousPage),
  'Extensions.setDeltaY': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.setDeltaY),
  'Extensions.handleScrollBarMove': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleScrollBarMove),
  'Extensions.handleScrollBarClick': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.handleScrollBarClick),
}

export const Css = [
  '/css/parts/ViewletExtensions.css',
  '/css/parts/InputBox.css',
]

export * from './ViewletExtensions.js'
