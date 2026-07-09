export const state: any = {
  terminals: Object.create(null),
}

export const add = (id: any, terminal: any): any => {
  state.terminals[id] = terminal
}

export const get = (id: any): any => {
  return state.terminals[id]
}

export const remove = (id: any): any => {
  delete state.terminals[id]
}
