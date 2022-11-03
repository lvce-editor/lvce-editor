export const state = {
  terminalModels: Object.create(null),
}

export const get = (id) => {
  const terminalModel = state.terminalModels[id]
  if (!terminalModel) {
    throw new Error('terminal model not found')
  }
  return terminalModel
}

export const create = (id) => {
  state.terminalModels[id] = {
    lines: [],
  }
}
