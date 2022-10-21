export const create = (id) => {
  return {
    disposed: false,
  }
}

export const loadContent = (state) => {
  return state
}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}
