const fileSystems = Object.create(null)

export const registerAll = (map) => {
  Object.assign(fileSystems, map)
}

export const get = (id) => {
  return fileSystems[id]
}
