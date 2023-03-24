import * as IconTheme from '../IconTheme/IconTheme.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
import * as TextSearchResultType from '../TextSearchResultType/TextSearchResultType.js'
import * as Workspace from '../Workspace/Workspace.js'

const toDisplayResults = (results, itemHeight, resultCount, searchTerm, minLineY, maxLineY) => {
  // results.sort(compareResults)
  const displayResults = []
  const setSize = resultCount
  let fileIndex = 0
  for (let i = 0; i < minLineY; i++) {
    const result = results[i]
    switch (result.type) {
      case TextSearchResultType.File:
        fileIndex++
        break
      default:
        break
    }
  }
  for (let i = minLineY; i < maxLineY; i++) {
    const result = results[i]
    switch (result.type) {
      case TextSearchResultType.File:
        const path = result.text
        const absolutePath = Workspace.getAbsolutePath(path)
        const baseName = Workspace.pathBaseName(path)
        displayResults.push({
          title: absolutePath,
          type: TextSearchResultType.File,
          text: baseName,
          icon: IconTheme.getFileIcon({ name: baseName }),
          posInSet: i + 1,
          setSize,
          top: i * itemHeight,
          lineNumber: result.lineNumber,
          matchStart: 0,
          matchLength: 0,
        })
        break
      case TextSearchResultType.Match:
        displayResults.push({
          title: result.text,
          type: TextSearchResultType.Match,
          text: result.text,
          icon: '',
          posInSet: i + 1,
          setSize,
          top: i * itemHeight,
          lineNumber: result.lineNumber,
          matchStart: result.start,
          matchLength: searchTerm.length,
        })
        break
      default:
        break
    }
  }
  return displayResults
}

export const hasFunctionalRender = true

const renderItems = {
  isEqual(oldState, newState) {
    return (
      oldState.items === newState.items &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY &&
      oldState.replacement === newState.replacement
    )
  },
  apply(oldState, newState) {
    const displayResults = toDisplayResults(
      newState.items,
      newState.itemHeight,
      newState.fileCount,
      newState.value,
      newState.minLineY,
      newState.maxLineY
    )
    return [/* method */ 'setResults', /* results */ displayResults, /* replacement */ newState.replacement]
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
      newState.scrollBarHeight
    )
    return [/* method */ 'setScrollBar', /* scrollBarY */ scrollBarY, /* scrollBarHeight */ newState.scrollBarHeight]
  },
}

const renderHeight = {
  isEqual(oldState, newState) {
    return oldState.items.length === newState.items.length
  },
  apply(oldState, newState) {
    const { itemHeight } = newState
    const contentHeight = newState.items.length * itemHeight
    return [/* method */ 'setContentHeight', /* contentHeight */ contentHeight]
  },
}

const renderMessage = {
  isEqual(oldState, newState) {
    return oldState.message === newState.message
  },
  apply(oldState, newState) {
    return [/* method */ 'setMessage', /* message */ newState.message]
  },
}

const renderValue = {
  isEqual(oldState, newState) {
    return oldState.value === newState.value
  },
  apply(oldState, newState) {
    return [/* method */ 'setValue', /* value */ newState.value]
  },
}

const renderNegativeMargin = {
  isEqual(oldState, newState) {
    return oldState.deltaY === newState.deltaY
  },
  apply(oldState, newState) {
    return [/* method */ 'setNegativeMargin', /* negativeMargin */ -newState.deltaY]
  },
}

const renderReplaceExpanded = {
  isEqual(oldState, newState) {
    return oldState.replaceExpanded === newState.replaceExpanded
  },
  apply(oldState, newState) {
    return [/* method */ 'setReplaceExpanded', newState.replaceExpanded]
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
    return [/* method */ 'setButtonsChecked', newState.matchWholeWord, newState.useRegularExpression, newState.matchCase]
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
    return [/* method */ 'setFocusedIndex', /* oldindex */ oldFocusedIndex, /* newIndex */ newFocusedIndex, /* focused */ newState.listFocused]
  },
}

export const render = [
  renderItems,
  renderMessage,
  renderValue,
  renderScrollBar,
  renderHeight,
  renderNegativeMargin,
  renderReplaceExpanded,
  renderButtonsChecked,
  renderFocusedIndex,
]
