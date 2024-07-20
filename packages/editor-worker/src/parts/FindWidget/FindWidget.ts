import * as FindMatchesCaseInsensitive from '../FindMatchesCaseInsensitive/FindMatchesCaseInsensitive.ts'
import * as GetMatchCount from '../GetMatchCount/GetMatchCount.ts'
import * as Editors from '../Editors/Editors.ts'

const getEditor = (editorUid: number) => {
  const instance = Editors.get(editorUid)
  const { newState } = instance
  return newState
}

export const getPosition = (uid: number) => {
  const editor = getEditor(uid)
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

export const loadContent = (state: any) => {
  const { editorUid } = state
  const editor = getEditor(editorUid)
  const { selections, lines } = editor
  const startRowIndex = selections[0]
  const startColumnIndex = selections[1]
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

export const refresh = (state: any, value = state.value) => {
  // TODO get focused editor
  const { editorUid } = state
  // highlight locations that match value
  const editor = getEditor(editorUid)
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

export const handleInput = (state: any, value: string) => {
  return refresh(state, value)
}

export const handleFocus = (state: any) => {
  // Focus.setFocus(FocusKey.FindWidget)
  return state
}

export const handleBlur = (state: any) => {
  // Focus.setFocus(FocusKey.Empty)
  return state
}

// TODO this function should be synchronous
export const focusIndex = async (state: any, index: number) => {
  const { value, matches, matchIndex } = state
  if (index === matchIndex) {
    return state
  }
  // TODO find next match and highlight it
  const matchRowIndex = matches[index * 2]
  const matchColumnIndex = matches[index * 2 + 1]
  // @ts-ignore
  const newSelections = new Uint32Array([matchRowIndex, matchColumnIndex, matchRowIndex, matchColumnIndex + value.length])
  // TODO set selections synchronously and render input match index,
  // input value and new selections at the same time
  // TODO
  // await Command.execute('Editor.setSelections', newSelections)
  return {
    ...state,
    matchIndex: index,
  }
}

export const focusFirst = (state: any) => {
  return focusIndex(state, 0)
}

export const focusLast = (state: any) => {
  const { matchCount } = state
  return focusIndex(state, matchCount - 1)
}

export const focusNext = (state: any) => {
  const { matchIndex, matchCount } = state
  if (matchIndex === matchCount - 1) {
    return focusFirst(state)
  }
  return focusIndex(state, matchIndex + 1)
}

export const focusPrevious = (state: any) => {
  const { matchIndex } = state
  if (matchIndex === 0) {
    return focusLast(state)
  }
  return focusIndex(state, matchIndex - 1)
}

export const close = async (state: any) => {
  // TODO
  // await Viewlet.closeWidget(uid)
  return {
    ...state,
    disposed: true,
  }
}
