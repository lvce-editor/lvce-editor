import * as VirtualList from '../VirtualList/VirtualList.ipc.js'
import * as ViewletSearch from './ViewletSearch.js'

export const Commands = {
  focusMatchCase: ViewletSearch.focusMatchCase,
  focusMatchCasePrevious: ViewletSearch.focusMatchCasePrevious,
  focusMatchWholeWord: ViewletSearch.focusMatchWholeWord,
  focusRegex: ViewletSearch.focusRegex,
  focusRegexNext: ViewletSearch.focusRegexNext,
  focusReplaceAll: ViewletSearch.focusReplaceAll,
  focusReplaceValue: ViewletSearch.focusReplaceValue,
  focusPreserveCasePrevious: ViewletSearch.focusPreserveCasePrevious,
  focusReplaceValueNext: ViewletSearch.focusReplaceValueNext,
  focusReplaceValuePrevious: ViewletSearch.focusReplaceValuePrevious,
  focusSearchValue: ViewletSearch.focusSearchValue,
  focusSearchValueNext: ViewletSearch.focusSearchValueNext,
  handleFocusIn: ViewletSearch.handleFocusIn,
  handleInput: ViewletSearch.handleInput,
  submit: ViewletSearch.submit,
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
