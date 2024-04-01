export const state = {
  styleSheets: Object.create(null),
}

export const set = (id, sheet) => {
  state.styleSheets[id] = sheet
}

export const get = (id) => {
  return state.styleSheets[id]
}

export const has = (id) => {
  return id in state.styleSheets
}

export const remove = (id) => {
  delete state.styleSheets[id]
}
