export const state = {
  pending: Object.create(null),
  references: Object.create(null),
}

export const get = (id) => {
  return state.pending[id]
}

export const has = (id) => {
  return id in state.pending
}

export const set = (id, value) => {
  state.pending[id] = value
}

export const remove = (id) => {
  delete state.pending[id]
}

export const addReference = (id) => {
  const count = (state.references[id] || 0) + 1
  state.references[id] = count
  return count
}

export const removeReference = (id) => {
  const count = state.references[id] || 0
  if (count <= 1) {
    delete state.references[id]
    return 0
  }
  const newCount = count - 1
  state.references[id] = newCount
  return newCount
}
