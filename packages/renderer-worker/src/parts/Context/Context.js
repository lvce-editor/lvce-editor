export const state = {
  // contexts: Object.create(null),
  contexts: {},
}

// TODO all context keys should be numeric
// comparing numbers is faster and more efficient than comparing strings every time
// e.g. map 'focus.editor' -> 1
// e.g. map 'focus.explorer' -> 2
// Context.get(1), Context.get(2)

export const get = (key) => {
  return state.contexts[key]
}

export const getAll = () => {
  return state.contexts
}

export const set = (key, value) => {
  state.contexts[key] = value
}

export const remove = (key) => {
  delete state.contexts[key]
}
