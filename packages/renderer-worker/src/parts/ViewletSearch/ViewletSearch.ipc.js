import * as ViewletSearch from './ViewletSearch.js'

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
  handleWheel: () => import('./ViewletSearchHandleWheel.js'),
  setDeltaY: () => import('./ViewletSearchSetDeltaY.js'),
  handleScrollBarClick: () => import('./ViewletSearchHandleScrollBarClick.js'),
  handleScrollBarMove: () => import('./ViewletSearchHandleScrollBarMove.js'),
}

export const Css = [
  '/css/parts/ViewletSearch.css',
  '/css/parts/ViewletList.css',
  '/css/parts/Label.css',
]

export * from './ViewletSearch.js'
