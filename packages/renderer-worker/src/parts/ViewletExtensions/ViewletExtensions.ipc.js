import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletExtensions from './ViewletExtensions.js'
import * as LazyCommand from '../LazyCommand/LazyCommand.js'

const Imports = {
  FocusFirst: () => import('./ViewletExtensionsFocusFirst.js'),
  FocusIndex: () => import('./ViewletExtensionsFocusIndex.js'),
  FocusLast: () => import('./ViewletExtensionsFocusLast.js'),
  FocusNext: () => import('./ViewletExtensionsFocusNext.js'),
  FocusNextPage: () => import('./ViewletExtensionsFocusNextPage.js'),
  FocusPrevious: () => import('./ViewletExtensionsFocusPrevious.js'),
  FocusPreviousPage: () => import('./ViewletExtensionsFocusPreviousPage.js'),
  HandleClick: () => import('./ViewletExtensionsHandleClick.js'),
}

// prettier-ignore
export const Commands = {
  'Extensions.closeSuggest': Viewlet.wrapViewletCommand('Extensions', ViewletExtensions.closeSuggest),
  'Extensions.focusFirst': LazyCommand.create('Extensions', Imports.FocusFirst, 'focusFirst'),
  'Extensions.focusIndex': LazyCommand.create('Extensions', Imports.FocusIndex, 'focusIndex'),
  'Extensions.focusLast': LazyCommand.create('Extensions', Imports.FocusLast, 'focusLast'),
  'Extensions.focusNext': LazyCommand.create('Extensions', Imports.FocusNext, 'focusNext'),
  'Extensions.focusNextPage': LazyCommand.create('Extensions', Imports.FocusNextPage, 'focusNextPage'),
  'Extensions.focusPrevious': LazyCommand.create('Extensions', Imports.FocusPrevious, 'focusPrevious'),
  'Extensions.focusPreviousPage': LazyCommand.create(Imports.FocusPreviousPage, 'focusPreviousPage'),
  'Extensions.handleClick': LazyCommand.create('Extensions', Imports.HandleClick, 'handleClick'),
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
