export const state = {
  terminals: Object.create(null),
}

export const add = (id, terminal) => {
  state.terminals[id] = terminal
}

export const get = (id) => {
  return state.terminals[id]
}

export const remove = (id) => {
  delete state.terminals[id]
}
