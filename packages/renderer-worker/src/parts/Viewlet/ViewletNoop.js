export const create = (id) => {
  return {
    disposed: false,
  }
}

export const loadContent = async (state) => {
  console.log('noop')
  return state
}

export const contentLoaded = async (state) => {}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}
