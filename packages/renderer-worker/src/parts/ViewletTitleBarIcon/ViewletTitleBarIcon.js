export const create = (id, uri, x, y, width, height) => {
  return {
    x,
    y,
    width,
    height,
  }
}

export const loadContent = async (state) => {
  return state
}

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  return state
}

export const hasFunctionalRender = true

export const render = []
