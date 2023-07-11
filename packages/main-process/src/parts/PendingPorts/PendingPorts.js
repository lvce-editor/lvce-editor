export const state = {
  ports: Object.create(null),
}

export const add = (key, port) => {
  state.ports[key] = port
}

export const get = (key) => {
  return state.ports[key]
}

export const _delete = (key) => {
  delete state.ports[key]
}
