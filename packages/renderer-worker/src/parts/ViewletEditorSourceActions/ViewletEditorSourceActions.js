import * as GetActiveEditor from '../GetActiveEditor/GetActiveEditor.js'
import * as GetEditorSourceActions from '../GetEditorSourceActions/GetEditorSourceActions.js'
import * as Focus from '../Focus/Focus.js'
import * as Command from '../Command/Command.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'

export const create = (id, uri, x, y, width, height) => {
  return {
    uid: id,
    id,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    maxHeight: 0,
    sourceActions: [],
    focusedIndex: -1,
  }
}

export const loadContent = async (state, savedState, position) => {
  const editor = GetActiveEditor.getActiveEditor()
  // TODO request source actions information from extensions
  const sourceActions = await GetEditorSourceActions.getEditorSourceActions()
  // TODO avoid side effect
  Focus.setAdditionalFocus(WhenExpression.FocusSourceActions)
  return {
    ...state,
    sourceActions,
    x: 200,
    y: -200,
    width: 250,
    height: 150,
    maxHeight: 150,
    focusedIndex: 0,
  }
}

export const handleFocus = () => {
  Focus.setFocus(WhenExpression.FocusSourceActions)
}

export const handleClick = (state, x, y) => {
  console.log('click', x, y)
  return state
}

export const focusNext = (state) => {
  const { focusedIndex } = state
  const nextFocusedIndex = focusedIndex + 1
  return {
    ...state,
    focusedIndex: nextFocusedIndex,
  }
}

export const focusPrevious = (state) => {
  const { focusedIndex } = state
  const previousFocusedIndex = focusedIndex - 1
  return {
    ...state,
    focusedIndex: previousFocusedIndex,
  }
}

export const focusLast = (state) => {
  return state
}

export const focusFirst = (state) => {
  return state
}

export const selectCurrent = async (state) => {
  const { focusedIndex, sourceActions } = state
  if (focusedIndex === -1) {
    return
  }
  const action = sourceActions[focusedIndex]
  const { command } = action
  await Command.execute(command)
  return state
}
