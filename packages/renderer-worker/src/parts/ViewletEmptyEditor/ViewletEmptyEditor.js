export const create = (id, uri, x, y, width, height) => {
  return {
    id,
    interval: -1,
    disposed: false,
  }
}

export const loadContent = (state) => {
  return {
    ...state,
  }
}

export const dispose = (state) => {}
