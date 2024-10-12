import * as GetSearchDisplayResults from '../GetSearchDisplayResults/GetSearchDisplayResults.js'
import * as GetSearchVirtualDom from '../GetSearchVirtualDom/GetSearchVirtualDom.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'
import type { SearchState } from './ViewletSearchTypes.ts'

export const hasFunctionalRender = true
export const hasFunctionalRootRender = true

const renderItems = {
  isEqual(oldState: SearchState, newState: SearchState) {
    return (
      oldState.items === newState.items &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY &&
      oldState.replacement === newState.replacement &&
      oldState.replaceExpanded === newState.replaceExpanded &&
      oldState.matchCase === newState.matchCase &&
      oldState.matchWholeWord === newState.matchWholeWord &&
      oldState.useRegularExpression === newState.useRegularExpression &&
      oldState.message === newState.message &&
      oldState.detailsExpanded === newState.detailsExpanded &&
      oldState.loaded === newState.loaded &&
      oldState.collapsedPaths === newState.collapsedPaths &&
      oldState.listFocusedIndex === newState.listFocusedIndex &&
      oldState.listFocused === newState.listFocused
    )
  },
  apply(oldState: SearchState, newState: SearchState) {
    const displayResults = GetSearchDisplayResults.getDisplayResults(
      newState.items,
      newState.itemHeight,
      newState.fileCount,
      newState.value,
      newState.minLineY,
      newState.maxLineY,
      newState.replacement,
      newState.collapsedPaths,
      newState.focusedIndex,
    )
    const focusOutline = newState.listFocused && newState.listFocusedIndex === -1
    const dom = GetSearchVirtualDom.getSearchVirtualDom(
      displayResults,
      newState.replaceExpanded,
      newState.matchCase,
      newState.matchWholeWord,
      newState.useRegularExpression,
      newState.message,
      newState.detailsExpanded,
      focusOutline,
    )
    return ['Viewlet.setDom2', dom]
  },
}

const getSelector = (focusKey) => {
  switch (focusKey) {
    case WhenExpression.FocusSearchInput:
      return '[name="search-value"]'
    case WhenExpression.FocusSearchReplaceInput:
      return '[name="search-replace-value"]'
    case WhenExpression.FocusSearchMatchCase:
      return '[title="Match Case"]'
    case WhenExpression.FocusSearchPreserveCase:
      return '[title="Preserve Case"]'
    case WhenExpression.FocusSearchRegex:
      return '[title="Use Regular Expression"]'
    default:
      return ''
  }
}

const renderFocus = {
  isEqual(oldState: SearchState, newState: SearchState) {
    return oldState.focus === newState.focus
  },
  apply(oldState: SearchState, newState: SearchState) {
    const selector = getSelector(newState.focus)
    return ['setFocus', selector]
  },
}

export const render = [renderItems, renderFocus]
