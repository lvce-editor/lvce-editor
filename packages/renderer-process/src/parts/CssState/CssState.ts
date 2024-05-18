const state = {
  styleSheets: Object.create(null),
}

export const set = (id, sheet) => {
  state.styleSheets[id] = sheet
}

export const get = (id) => {
  return state.styleSheets[id]
}
