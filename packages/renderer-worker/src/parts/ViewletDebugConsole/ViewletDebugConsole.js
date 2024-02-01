import * as DebugConsoleModel from '../DebugConsoleModel/DebugConsoleModel.js'
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
  const result = await DebugConsoleModel.evaluate(inputValue)
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
