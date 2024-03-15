import * as WhenExpression from '../WhenExpression/WhenExpression.js'

export const getSearchFocusKey = (key) => {
  switch (key) {
    case 'search-value':
      return WhenExpression.FocusSearchInput
    case 'search-replace-value':
      return WhenExpression.FocusSearchReplaceInput
    case 'Match Case':
      return WhenExpression.FocusMatchCase
    case 'Match Whole Word':
      return WhenExpression.FocusWholeWord
    case 'Use Regular Expression':
      return WhenExpression.FocusRegex
    case 'Replace All':
      return WhenExpression.FocusReplaceAll
    case 'Preserve Case':
      return WhenExpression.FocusPreserveCase
    default:
      return WhenExpression.Empty
  }
}
