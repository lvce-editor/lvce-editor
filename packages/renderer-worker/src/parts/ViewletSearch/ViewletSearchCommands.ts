import * as VirtualList from '../VirtualList/VirtualList.ipc.js'
import * as ViewletSearch from './ViewletSearch.ts'

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
  handleContextMenuKeyboard: () => import('./ViewletSearchHandleContextMenuKeyBoard.ts'),
  handleContextMenuMouseAt: () => import('./ViewletSearchHandleContextMenuMouseAt.ts'),
  toggleReplace: () => import('./ViewletSearchToggleReplace.ts'),
  toggleUseRegularExpression: () => import('./ViewletSearchToggleUseRegularExpression.ts'),
  toggleMatchWholeWord: () => import('./ViewletSearchToggleMatchWholeWord.ts'),
  toggleMatchCase: () => import('./ViewletSearchToggleMatchCase.ts'),
  replaceAll: () => import('./ViewletSearchReplaceAll.ts'),
  handleReplaceInput: () => import('./ViewletSearchHandleReplaceInput.ts'),
  handleUpdate: () => import('./ViewletSearchHandleUpdate.ts'),
  handleListFocus: () => import('./ViewletSearchHandleListFocus.js'),
  handleListBlur: () => import('./ViewletSearchHandleListBlur.ts'),
  ...VirtualList.LazyCommands,
  focusFirst: () => import('./ViewletSearchFocusFirst.ts'),
  focusLast: () => import('./ViewletSearchFocusLast.ts'),
  focusNext: () => import('./ViewletSearchFocusNext.ts'),
  focusPrevious: () => import('./ViewletSearchFocusPrevious.ts'),
  handleClick: () => import('./ViewletSearchHandleClick.ts'),
  handleClickAt: () => import('./ViewletSearchHandleClick.ts'),
  selectIndex: () => import('./ViewletSearchSelectIndex.ts'),
  dismissItem: () => import('./ViewletSearchDismissItem.ts'),
  copy: () => import('./ViewletSearchCopy.ts'),
  refresh: () => import('./ViewletSearchRefresh.ts'),
  clearSearchResults: () => import('./ViewletSearchClearSearchResults.ts'),
}
