import * as GetSearchDisplayResults from '../GetSearchDisplayResults/GetSearchDisplayResults.js'
import * as GetSearchResultsVirtualDom from '../GetSearchResultsVirtualDom/GetSearchResultsVirtualDom.js'
import * as InputSource from '../InputSource/InputSource.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'

export const hasFunctionalRender = true

const renderItems = {
  isEqual(oldState, newState) {
    return (
      oldState.items === newState.items &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY &&
      oldState.replacement === newState.replacement &&
      oldState.replaceExpanded === newState.replaceExpanded
    )
  },
  apply(oldState, newState) {
    const displayResults = GetSearchDisplayResults.getDisplayResults(
      newState.items,
      newState.itemHeight,
      newState.fileCount,
      newState.value,
      newState.minLineY,
      newState.maxLineY,
      newState.replacement,
    )
    const dom = GetSearchResultsVirtualDom.getSearchResultsVirtualDom(displayResults, false)
    return ['setDom', dom]
  },
}

const renderScrollBar = {
  isEqual(oldState, newState) {
    return oldState.deltaY === newState.deltaY && oldState.height === newState.height && oldState.finalDeltaY === newState.finalDeltaY
  },
  apply(oldState, newState) {
    const scrollBarY = ScrollBarFunctions.getScrollBarY(
      newState.deltaY,
      newState.finalDeltaY,
      newState.height - newState.headerHeight,
      newState.scrollBarHeight,
    )
    return [/* method */ RenderMethod.SetScrollBar, /* scrollBarY */ scrollBarY, /* scrollBarHeight */ newState.scrollBarHeight]
  },
}

const renderMessage = {
  isEqual(oldState, newState) {
    return oldState.message === newState.message
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetMessage, /* message */ newState.message]
  },
}

const renderValue = {
  isEqual(oldState, newState) {
    if (newState.inputSource === InputSource.User) {
      return true
    }
    return oldState.value === newState.value
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetValue, /* value */ newState.value]
  },
}

const renderNegativeMargin = {
  isEqual(oldState, newState) {
    return oldState.deltaY === newState.deltaY
  },
  apply(oldState, newState) {
    const relative = newState.deltaY % 22
    return [/* method */ RenderMethod.SetNegativeMargin, /* negativeMargin */ -relative]
  },
}

const renderReplaceExpanded = {
  isEqual(oldState, newState) {
    return oldState.replaceExpanded === newState.replaceExpanded
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetReplaceExpanded, newState.replaceExpanded]
  },
}

const renderButtonsChecked = {
  isEqual(oldState, newState) {
    return (
      oldState.matchWholeWord === newState.matchWholeWord &&
      oldState.useRegularExpression === newState.useRegularExpression &&
      oldState.matchCase === newState.matchCase
    )
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetButtonsChecked, newState.matchWholeWord, newState.useRegularExpression, newState.matchCase]
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return (
      oldState.listFocusedIndex === newState.listFocusedIndex &&
      oldState.listFocused === newState.listFocused &&
      oldState.minLineY === newState.minLineY
    )
  },
  apply(oldState, newState) {
    const oldFocusedIndex = oldState.listFocusedIndex - oldState.minLineY
    const newFocusedIndex = newState.listFocusedIndex - newState.minLineY
    return [
      /* method */ RenderMethod.SetFocusedIndex,
      /* oldindex */ oldFocusedIndex,
      /* newIndex */ newFocusedIndex,
      /* focused */ newState.listFocused,
    ]
  },
}

export const render = [
  renderItems,
  renderMessage,
  renderValue,
  renderScrollBar,
  renderNegativeMargin,
  renderReplaceExpanded,
  renderButtonsChecked,
  renderFocusedIndex,
]
