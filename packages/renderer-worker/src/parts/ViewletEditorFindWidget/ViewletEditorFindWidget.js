import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as TextDocumentSearch from '../TextDocumentSearch/TextDocumentSearch.js'

export const name = 'EditorFindWidget'

export const create = () => {
  return {
    value: '',
    matchIndex: 0,
    totalMatches: 0,
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
  const width = 200
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
  const totalMatches = matches.length

  return {
    ...state,
    value,
    matchIndex: 1,
    totalMatches,
  }
}

export const handleInput = (state, value) => {
  // TODO get focused editor
  // highlight locations that match value
  const editor = ViewletStates.getState('EditorText')
  const { lines, selections } = editor
  const startRowIndex = selections[0]
  const startColumnIndex = selections[1]
  const endRowIndex = selections[2]
  const endColumnIndex = selections[3]
  const matches = TextDocumentSearch.findMatches(lines, value)
  const totalMatches = matches.length
  console.log({ matches })
  return {
    ...state,
    value,
    totalMatches,
  }
}

export const focusNext = (state) => {
  const { value } = state
  const editor = ViewletStates.getState('EditorText')
  const { lines, selections } = editor
  const startRowIndex = selections[0]
  const startColumnIndex = selections[1]
  const endRowIndex = selections[2]
  const endColumnIndex = selections[3]
  // TODO find next match and highlight it
  const nextMatch = TextDocumentSearch.findNextMatch(
    lines,
    value,
    startRowIndex + 1
  )
  const newSelections = new Uint32Array([
    nextMatch.rowIndex,
    nextMatch.columnIndex,
    nextMatch.rowIndex,
    nextMatch.columnIndex + value.length,
  ])
  // TODO set editor selection and reveal position
  console.log({ lines, nextMatch, newSelections })
  return {
    ...state,
  }
}

export const hasFunctionalRender = true

const renderValue = {
  isEqual(oldState, newState) {
    return oldState.value === newState.value
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ 'EditorFindWidget',
      /* method */ 'setValue',
      /* value */ newState.value,
    ]
  },
}

const renderMatchCount = {
  isEqual(oldState, newState) {
    return (
      oldState.matchIndex === newState.matchIndex &&
      oldState.totalMatches === newState.totalMatches
    )
  },
  apply(oldState, newState) {
    const matchCountText = `${newState.matchIndex} of ${newState.totalMatches}`
    return [
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ 'EditorFindWidget',
      /* method */ 'setMatchCountText',
      /* value */ matchCountText,
    ]
  },
}

export const render = [renderValue, renderMatchCount]
