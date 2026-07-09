import * as UpdateStateType from '../UpdateStateType/UpdateStateType.ts'

export const state = {
  updateState: UpdateStateType.Uninitialized,
}

export const get = () => {
  return state.updateState
}

export const set = (value) => {
  state.updateState = value
}
