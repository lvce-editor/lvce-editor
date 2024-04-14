export const state = {
  ptyMap: Object.create(null),
}

export const set = (id, pty) => {
  state.ptyMap[id] = pty
}

export const get = (id) => {
  return state.ptyMap[id]
}

export const remove = (id) => {
  delete state.ptyMap[id]
}

export const getAll = () => {
  return state.ptyMap
}
