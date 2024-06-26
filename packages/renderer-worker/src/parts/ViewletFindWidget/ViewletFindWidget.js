import * as Command from '../Command/Command.js'
import * as FindMatchesCaseInsensitive from '../FindMatchesCaseInsensitive/FindMatchesCaseInsensitive.js'
import * as Focus from '../Focus/Focus.js'
import * as FocusKey from '../FocusKey/FocusKey.js'
import * as GetActiveEditor from '../GetActiveEditor/GetActiveEditor.js'
import * as GetMatchCount from '../GetMatchCount/GetMatchCount.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

export const create = (uid) => {
  return {
    value: '',
    ariaAnnouncement: '',
    matches: new Uint32Array(),
    matchIndex: -1,
    matchCount: 0,
    uid,
    replaceExpanded: false,
    useRegularExpression: false,
    matchCase: false,
    matchWholeWord: false,
    replacement: '',
  }
}

export const getPosition = () => {
  const editor = GetActiveEditor.getActiveEditor()
  if (!editor) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    }
  }
  const width = 300
  const height = 30
  const paddingTop = 10
  const paddingRight = 20
  const x = editor.x + editor.width - width - paddingRight
  const y = editor.y + paddingTop
  return {
    y,
    x,
    width,
    height,
  }
}

export const loadContent = (state) => {
  const editor = GetActiveEditor.getActiveEditor()
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
  const matches = FindMatchesCaseInsensitive.findMatchesCaseInsensitive(lines, value)
  const matchCount = GetMatchCount.getMatchCount(matches)
  return {
    ...state,
    value,
    matches,
    matchIndex: 0,
    matchCount,
  }
}

export const refresh = (state, value = state.value) => {
  // TODO get focused editor
  // highlight locations that match value
  const editor = GetActiveEditor.getActiveEditor()
  const { lines } = editor
  const matches = FindMatchesCaseInsensitive.findMatchesCaseInsensitive(lines, value)
  const matchCount = GetMatchCount.getMatchCount(matches)
  return {
    ...state,
    matches,
    matchIndex: 0,
    matchCount,
    value,
  }
}

export const handleInput = (state, value) => {
  return refresh(state, value)
}

export const handleFocus = (state) => {
  Focus.setFocus(FocusKey.FindWidget)
  return state
}

export const handleBlur = (state) => {
  Focus.setFocus(FocusKey.Empty)
  return state
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
  const newSelections = new Uint32Array([matchRowIndex, matchColumnIndex, matchRowIndex, matchColumnIndex + value.length])
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

export const close = async (state) => {
  const { uid } = state
  await Viewlet.closeWidget(uid)
  return {
    ...state,
    disposed: true,
  }
}
