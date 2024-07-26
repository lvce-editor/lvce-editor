import * as ViewletFindWidget from './ViewletFindWidget.ts'

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
  toggleReplace: () => import('../ViewletSearch/ViewletSearchToggleReplace.ts'),
  toggleUseRegularExpression: () => import('../ViewletSearch/ViewletSearchToggleUseRegularExpression.ts'),
  toggleMatchWholeWord: () => import('../ViewletSearch/ViewletSearchToggleMatchWholeWord.ts'),
  toggleMatchCase: () => import('../ViewletSearch/ViewletSearchToggleMatchCase.ts'),
  replaceAll: () => import('../ViewletSearch/ViewletSearchReplaceAll.ts'),
  handleReplaceInput: () => import('../ViewletSearch/ViewletSearchHandleReplaceInput.ts'),
}
