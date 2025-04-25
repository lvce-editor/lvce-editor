const map = Object.create(null)

export const register = (id, importFn) => {
  map[id] = importFn
}

export const registerAll = (input) => {
  Object.assign(map, input)
}

export const load = (moduleId) => {
  if (!map[moduleId]) {
    return {}
  }
  return map[moduleId]()
}
