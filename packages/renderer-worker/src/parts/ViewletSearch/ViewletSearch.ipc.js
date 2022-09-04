import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletSearch from './ViewletSearch.js'

// prettier-ignore
export const Commands = {
  'Search.handleInput': Viewlet.wrapViewletCommand('Search', ViewletSearch.handleInput),
  'Search.handleClick': Viewlet.wrapViewletCommand('Search', ViewletSearch.handleClick),
  'Search.setValue': Viewlet.wrapViewletCommand('Search', ViewletSearch.setValue),
  'Search.handleContextMenuMouse': Viewlet.wrapViewletCommand('Search', ViewletSearch.handleContextMenuMouse),
  'Search.handleContextMenuKeyboard': Viewlet.wrapViewletCommand('Search', ViewletSearch.handleContextMenuKeyboard),
}

export * from './ViewletSearch.js'
