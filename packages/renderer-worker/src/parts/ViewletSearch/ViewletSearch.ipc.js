import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletSearch from './ViewletSearch.js'

// prettier-ignore
export const Commands = {
  'Search.handleClick': Viewlet.wrapViewletCommand(ViewletSearch.name, ViewletSearch.handleClick),
  'Search.handleContextMenuKeyboard': Viewlet.wrapViewletCommand(ViewletSearch.name, ViewletSearch.handleContextMenuKeyboard),
  'Search.handleContextMenuMouseAt': Viewlet.wrapViewletCommand(ViewletSearch.name, ViewletSearch.handleContextMenuMouseAt),
  'Search.handleInput': Viewlet.wrapViewletCommand(ViewletSearch.name, ViewletSearch.handleInput),
  'Search.setValue': Viewlet.wrapViewletCommand(ViewletSearch.name, ViewletSearch.setValue),
}

export * from './ViewletSearch.js'
