import * as VirtualList from '../VirtualList/VirtualList.ipc.js'
import * as ViewletSearch from './ViewletSearch.js'

// prettier-ignore
export const Commands = {
  handleInput: ViewletSearch.handleInput,
}

// prettier-ignore
export const LazyCommands = {
  handleContextMenu: () => import('./ViewletSearchHandleContextMenu.js'),
  handleContextMenuKeyboard: () => import('./ViewletSearchHandleContextMenuKeyBoard.js'),
  handleContextMenuMouseAt: () => import('./ViewletSearchHandleContextMenuMouseAt.js'),
  toggleReplace: () => import('./ViewletSearchToggleReplace.js'),
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
  dismissItem: () => import('./ViewletSearchDismissItem.js'),
  copy: () => import('./ViewletSearchCopy.js'),
  refresh: () => import('./ViewletSearchRefresh.js'),
  clearSearchResults: () => import('./ViewletSearchClearSearchResults.js'),
}
