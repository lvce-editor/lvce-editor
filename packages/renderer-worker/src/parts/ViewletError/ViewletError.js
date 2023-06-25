export const create = (id, uri, x, y, width, height) => {
  return {
    id,
    uri,
    x,
    y,
    width,
    height,
  }
}

export const setError = (state, error) => {
  const message = `${error}`
  return {
    ...state,
    message,
  }
}
