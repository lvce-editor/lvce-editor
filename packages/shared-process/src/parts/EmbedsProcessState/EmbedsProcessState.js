import * as EmbedsProcess from '../EmbedsProcess/EmbedsProcess.js'

const state = {
  ref: 0,
}

export const increment = () => {
  state.ref++
}

export const get = () => {
  return state.ref
}

export const decrement = async () => {
  state.ref--
}
