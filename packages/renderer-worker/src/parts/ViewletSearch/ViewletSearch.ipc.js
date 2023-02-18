import * as VirtualList from '../VirtualList/VirtualList.ipc.js'
import * as ViewletSearch from './ViewletSearch.js'

export const name = 'Search'

// prettier-ignore
export const Commands = {
  handleClick: ViewletSearch.handleClick,
  handleInput: ViewletSearch.handleInput,
  setValue: ViewletSearch.setValue,
}

// prettier-ignore
export const LazyCommands = {
  handleContextMenuKeyboard: () => import('./ViewletSearchHandleContextMenuKeyBoard.js'),
  handleContextMenuMouseAt: () => import('./ViewletSearchHandleContextMenuMouseAt.js'),
  handleToggleButtonClick: () => import('./ViewletSearchHandleToggleButtonClick.js'),
  toggleUseRegularExpression: () => import('./ViewletSearchToggleUseRegularExpression.js'),
  toggleMatchWholeWord: () => import('./ViewletSearchToggleMatchWholeWord.js'),
  toggleMatchCase: () => import('./ViewletSearchToggleMatchCase.js'),
  ...VirtualList.LazyCommands,
}

export const Css = [
  '/css/parts/Highlight.css',
  '/css/parts/InputBox.css',
  '/css/parts/Label.css',
  '/css/parts/ViewletList.css',
  '/css/parts/ViewletSearch.css',
  '/css/parts/TreeItem.css',
  '/css/parts/ScrollBar.css',
]

export * from './ViewletSearch.js'
