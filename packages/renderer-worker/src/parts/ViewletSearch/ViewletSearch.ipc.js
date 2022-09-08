import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletSearch from './ViewletSearch.js'

// prettier-ignore
export const Commands = {
  'Search.handleClick': Viewlet.wrapViewletCommand('Search', ViewletSearch.handleClick),
  'Search.handleContextMenuKeyboard': Viewlet.wrapViewletCommand('Search', ViewletSearch.handleContextMenuKeyboard),
  'Search.handleContextMenuMouseAt': Viewlet.wrapViewletCommand('Search', ViewletSearch.handleContextMenuMouseAt),
  'Search.handleInput': Viewlet.wrapViewletCommand('Search', ViewletSearch.handleInput),
  'Search.setValue': Viewlet.wrapViewletCommand('Search', ViewletSearch.setValue),
}

export * from './ViewletSearch.js'
