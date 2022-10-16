const state = {
  ports: Object.create(null),
}

exports.state = state

exports.add = (key, port) => {
  state.ports[key] = port
}

exports.get = (key) => {
  return state.ports[key]
}

exports.delete = (key) => {
  delete state.ports[key]
}
