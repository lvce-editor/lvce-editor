import * as UpdateStateType from '../UpdateStateType/UpdateStateType.js'

export const state = {
  updateState: UpdateStateType.Uninitialized,
}

export const get = () => {
  return state.updateState
}

export const set = (value) => {
  state.updateState = value
}
