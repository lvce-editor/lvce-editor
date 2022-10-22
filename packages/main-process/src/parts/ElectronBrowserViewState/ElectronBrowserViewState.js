const state = {
  browserViews: Object.create(null),
}

exports.add = (id, browserView) => {
  // state
  state.browserViews[id] = browserView
}

exports.get = (id) => {
  return state.browserViews[id]
}

exports.getAll = () => {
  return Object.values(state.browserViews)
}

exports.remove = (id) => {
  delete state.browserViews[id]
}

exports.getAnyKey = () => {
  const keys = Object.keys(state.browserViews)
  if (keys.length === 0) {
    throw new Error('no browser view found')
  }
  return parseInt(keys[0])
}
