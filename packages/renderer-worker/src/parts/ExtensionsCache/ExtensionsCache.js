const cache = Object.create(null)

const id = 1

export const get = () => {
  return cache[id]
}

export const has = () => {
  return id in cache
}

export const set = (value) => {
  cache[id] = value
}
