import * as ViewletFindWidget from './ViewletFindWidget.js'

// prettier-ignore
export const Commands = {
  focusNext: ViewletFindWidget.focusNext,
  focusPrevious: ViewletFindWidget.focusPrevious,
  handleInput: ViewletFindWidget.handleInput,
  refresh: ViewletFindWidget.refresh,
  handleFocus: ViewletFindWidget.handleFocus,
  handleBlur: ViewletFindWidget.handleBlur,
  close: ViewletFindWidget.close,
}

// prettier-ignore
// TODO move these commands to a shared folder
export const LazyCommands = {
  toggleReplace: () => import('../ViewletSearch/ViewletSearchToggleReplace.js'),
  toggleUseRegularExpression: () => import('../ViewletSearch/ViewletSearchToggleUseRegularExpression.js'),
  toggleMatchWholeWord: () => import('../ViewletSearch/ViewletSearchToggleMatchWholeWord.js'),
  toggleMatchCase: () => import('../ViewletSearch/ViewletSearchToggleMatchCase.js'),
  replaceAll: () => import('../ViewletSearch/ViewletSearchReplaceAll.js'),
  handleReplaceInput: () => import('../ViewletSearch/ViewletSearchHandleReplaceInput.js'),
}
