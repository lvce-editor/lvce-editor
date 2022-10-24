import * as ViewletSearch from './ViewletSearch.js'

// prettier-ignore
export const Commands = {
  'Search.handleClick': ViewletSearch.handleClick,
  'Search.handleContextMenuKeyboard': ViewletSearch.handleContextMenuKeyboard,
  'Search.handleContextMenuMouseAt': ViewletSearch.handleContextMenuMouseAt,
  'Search.handleInput': ViewletSearch.handleInput,
  'Search.setValue': ViewletSearch.setValue,
}

export const Css = '/css/parts/ViewletSearch.css'

export * from './ViewletSearch.js'
