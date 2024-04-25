const state = {
  id: 0,
}

export const set = (value) => {
  state.id = value
}

export const get = () => {
  return state.id
}
