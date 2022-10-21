export const name = 'Debug Console'

export const create = () => {
  return {
    disposed: false,
  }
}

export const loadContent = async (state) => {
  return state
}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}
