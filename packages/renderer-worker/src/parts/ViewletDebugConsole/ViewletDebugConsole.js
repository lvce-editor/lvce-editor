import * as Debug from '../Debug/Debug.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Focus from '../Focus/Focus.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'

export const create = (uid) => {
  return {
    uid,
    text: '-',
    inputValue: '',
  }
}

export const loadContent = async (state) => {
  return {
    ...state,
    text: '',
  }
}

export const handleInput = (state, value) => {
  return {
    ...state,
    inputValue: value,
  }
}
export const handleFocus = (state) => {
  Focus.setFocus(WhenExpression.FocusDebugConsoleInput)
  return state
}

export const evaluate = async (state) => {
  const { inputValue } = state
  // TODO don't depend on other component state
  const debugState = ViewletStates.getState(ViewletModuleId.RunAndDebug)
  if (!debugState) {
    return state
  }
  const { debugId, callFrameId } = debugState
  const result = await Debug.evaluate(debugId, inputValue, callFrameId)
  return {
    ...state,
    text: `${state.text}\n${result}`,
  }
}

export const clear = (state) => {
  return {
    ...state,
    text: '',
  }
}
