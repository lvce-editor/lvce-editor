const contexts = Object.create(null)

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
