import * as UpdateStateType from '../UpdateStateType/UpdateStateType.ts'

export const state: any = {
  updateState: UpdateStateType.Uninitialized,
}

export const get = (): any => {
  return state.updateState
}

export const set = (value: any): any => {
  state.updateState = value
}
