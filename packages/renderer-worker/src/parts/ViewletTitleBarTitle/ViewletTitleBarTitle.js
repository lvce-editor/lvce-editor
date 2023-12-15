export const create = (id, uri, x, y, width, height) => {
  return {
    x,
    y,
    width,
    height,
    title: '',
  }
}

export const loadContent = async (state) => {
  return {
    ...state,
    title: 'test',
  }
}
