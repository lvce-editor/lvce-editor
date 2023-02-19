import * as VirtualList from '../VirtualList/VirtualList.ipc.js'
import * as ViewletSearch from './ViewletSearch.js'

export const name = 'Search'

// prettier-ignore
export const Commands = {
  handleInput: ViewletSearch.handleInput,
}

// prettier-ignore
export const LazyCommands = {
  handleContextMenu: () => import('./ViewletSearchHandleContextMenu.js'),
  handleContextMenuKeyboard: () => import('./ViewletSearchHandleContextMenuKeyBoard.js'),
  handleContextMenuMouseAt: () => import('./ViewletSearchHandleContextMenuMouseAt.js'),
  handleToggleButtonClick: () => import('./ViewletSearchHandleToggleButtonClick.js'),
  toggleUseRegularExpression: () => import('./ViewletSearchToggleUseRegularExpression.js'),
  toggleMatchWholeWord: () => import('./ViewletSearchToggleMatchWholeWord.js'),
  toggleMatchCase: () => import('./ViewletSearchToggleMatchCase.js'),
  replaceAll: () => import('./ViewletSearchReplaceAll.js'),
  handleReplaceInput: () => import('./ViewletSearchHandleReplaceInput.js'),
  handleUpdate: () => import('./ViewletSearchHandleUpdate.js'),
  handleListFocus: () => import('./ViewletSearchHandleListFocus.js'),
  handleListBlur: () => import('./ViewletSearchHandleListBlur.js'),
  ...VirtualList.LazyCommands,
  focusFirst: () => import('./ViewletSearchFocusFirst.js'),
  focusLast: () => import('./ViewletSearchFocusLast.js'),
  focusNext: () => import('./ViewletSearchFocusNext.js'),
  focusPrevious: () => import('./ViewletSearchFocusPrevious.js'),
  handleClick: () => import('./ViewletSearchHandleClick.js'),
  selectIndex: () => import('./ViewletSearchSelectIndex.js'),
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
