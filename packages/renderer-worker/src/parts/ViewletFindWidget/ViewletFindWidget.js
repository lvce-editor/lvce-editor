import * as Command from '../Command/Command.js'
import * as I18nString from '../I18NString/I18NString.js'
import * as TextDocumentSearch from '../TextDocumentSearch/TextDocumentSearch.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

/**
 * @enum {string}
 */
const UiStrings = {
  MatchesFoundFor: `{PH1} of {PH2} found for {PH3}`,
  MatchOf: `{PH1} of {PH2}`,
  NoResults: 'No Results',
}

export const create = () => {
  return {
    value: '',
    ariaAnnouncement: '',
    matches: new Uint32Array(),
    matchIndex: 0,
    matchCount: 0,
  }
}

export const getPosition = () => {
  const editor = ViewletStates.getState('EditorText')
  if (!editor) {
    return {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    }
  }
  const width = 300
  const height = 30
  const paddingTop = 10
  const paddingRight = 20
  const left = editor.left + editor.width - width - paddingRight
  const top = editor.top + paddingTop
  return {
    top,
    left,
    width,
    height,
  }
}

const getMatchCount = (matches) => {
  return matches.length / 2
}

export const loadContent = (state) => {
  const editor = ViewletStates.getState('EditorText')
  if (!editor) {
    return state
  }
  const { selections, lines } = editor
  const startRowIndex = selections[0]
  const startColumnIndex = selections[1]
  const endRowIndex = selections[2]
  const endColumnIndex = selections[3]
  const line = lines[startRowIndex]
  const value = line.slice(startColumnIndex, endColumnIndex)
  const matches = TextDocumentSearch.findMatches(lines, value)
  const matchCount = getMatchCount(matches)
  return {
    ...state,
    value,
    matches,
    matchIndex: 0,
    matchCount,
  }
}

export const handleInput = (state, value) => {
  // TODO get focused editor
  // highlight locations that match value
  const editor = ViewletStates.getState('EditorText')
  const { lines } = editor
  const matches = TextDocumentSearch.findMatches(lines, value)
  const matchCount = getMatchCount(matches)
  return {
    ...state,
    matches,
    matchIndex: 0,
    matchCount,
    value,
  }
}

// TODO this function should be synchronous
export const focusIndex = async (state, index) => {
  const { value, matches, matchIndex } = state
  if (index === matchIndex) {
    return state
  }
  // TODO find next match and highlight it
  const matchRowIndex = matches[index * 2]
  const matchColumnIndex = matches[index * 2 + 1]
  const newSelections = new Uint32Array([
    matchRowIndex,
    matchColumnIndex,
    matchRowIndex,
    matchColumnIndex + value.length,
  ])
  // TODO set selections synchronously and render input match index,
  // input value and new selections at the same time
  await Command.execute('Editor.setSelections', newSelections)
  return {
    ...state,
    matchIndex: index,
  }
}

export const focusFirst = (state) => {
  return focusIndex(state, 0)
}

export const focusLast = (state) => {
  const { matchCount } = state
  return focusIndex(state, matchCount - 1)
}

export const focusNext = (state) => {
  const { matchIndex, matchCount } = state
  if (matchIndex === matchCount - 1) {
    return focusFirst(state)
  }
  return focusIndex(state, matchIndex + 1)
}

export const focusPrevious = (state) => {
  const { matchIndex } = state
  if (matchIndex === 0) {
    return focusLast(state)
  }
  return focusIndex(state, matchIndex - 1)
}

export const hasFunctionalRender = true

const renderValue = {
  isEqual(oldState, newState) {
    return oldState.value === newState.value
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ ViewletModuleId.FindWidget,
      /* method */ 'setValue',
      /* value */ newState.value,
    ]
  },
}

const getMatchCountText = (matchIndex, matchCount) => {
  if (matchCount === 0) {
    return I18nString.i18nString(UiStrings.NoResults)
  }
  return I18nString.i18nString(UiStrings.MatchOf, {
    PH1: matchIndex + 1,
    PH2: matchCount,
  })
}

const renderMatchCount = {
  isEqual(oldState, newState) {
    return (
      oldState.matchIndex === newState.matchIndex &&
      oldState.matchCount === newState.matchCount
    )
  },
  apply(oldState, newState) {
    const matchCountText = getMatchCountText(
      newState.matchIndex,
      newState.matchCount
    )
    return [/* method */ 'setMatchCountText', /* value */ matchCountText]
  },
}

const renderButtonsEnabled = {
  isEqual(oldState, newState) {
    return oldState.matchCount === newState.matchCount
  },
  apply(oldState, newState) {
    const enabled = newState.matchCount > 0
    return [/* method */ 'setButtonsEnabled', /* enabled */ enabled]
  },
}

const getAriaLabel = (state) => {
  const { matchIndex, matchCount, value } = state
  return I18nString.i18nString(UiStrings.MatchesFoundFor, {
    PH1: matchIndex,
    PH2: matchCount,
    PH3: value,
  })
}

const renderAriaAnnouncement = {
  isEqual(oldState, newState) {
    return (
      oldState.ariaAnnouncement === newState.ariaAnnouncement &&
      oldState.matchIndex === newState.matchIndex &&
      oldState.matchCount === newState.matchCount &&
      oldState.value === newState.value
    )
  },
  apply(oldState, newState) {
    const ariaLabel = getAriaLabel(newState)
    return [/* Viewlet.invoke */ 'Viewlet.ariaAnnounce', /* text */ ariaLabel]
  },
}

export const render = [
  renderValue,
  renderMatchCount,
  renderAriaAnnouncement,
  renderButtonsEnabled,
]
