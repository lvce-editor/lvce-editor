const contexts = Object.create(null)

// TODO all context keys should be numeric
// comparing numbers is faster and more efficient than comparing strings every time
// e.g. map 'focus.editor' -> 1
// e.g. map 'focus.explorer' -> 2
// Context.get(1), Context.get(2)

export const get = (key) => {
  return contexts[key]
}

export const getAll = () => {
  return contexts
}

export const set = (key, value) => {
  contexts[key] = value
}

export const remove = (key) => {
  delete contexts[key]
}
