const state = {
  ref: 0,
}

export const increment = () => {
  state.ref++
}

export const hasRef = () => {
  return state.ref > 0
}

export const decrement = async () => {
  state.ref--
}
