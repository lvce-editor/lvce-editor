export const name = 'Image'

export const create = (id, uri, left, top, width, height) => {
  return {
    id,
    uri,
  }
}

export const loadContent = (state) => {
  return state
}

export const contentLoaded = async (state) => {}

export const dispose = (state) => {}
