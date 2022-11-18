import * as ViewletSearch from './ViewletSearch.js'
import * as VirtualList from '../VirtualList/VirtualList.ipc.js'

export const name = 'Search'

// prettier-ignore
export const Commands = {
  handleClick: ViewletSearch.handleClick,
  handleContextMenuKeyboard: ViewletSearch.handleContextMenuKeyboard,
  handleContextMenuMouseAt: ViewletSearch.handleContextMenuMouseAt,
  handleInput: ViewletSearch.handleInput,
  setValue: ViewletSearch.setValue,
}

// prettier-ignore
export const LazyCommands = {
  ...VirtualList.LazyCommands,
}

export const Css = [
  '/css/parts/ViewletSearch.css',
  '/css/parts/ViewletList.css',
  '/css/parts/Label.css',
  '/css/parts/InputBox.css',
]

export * from './ViewletSearch.js'
