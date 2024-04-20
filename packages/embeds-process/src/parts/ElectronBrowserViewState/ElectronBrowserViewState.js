const state = {
  browserViews: Object.create(null),
}

export const add = (id) => {
  state.browserViews[id] = id
}

export const remove = (id) => {
  delete state.browserViews[id]
}

export const getAll = () => {
  return Object.values(state.browserViews)
}
