export const name = 'RunAndDebug'

export const create = (id) => {
  return {
    id,
    disposed: false,
  }
}

export const loadContent = async (state) => {
  return state
}

// TODO make sure dispose is actually called
export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

export const resize = (state, dimensions) => {
  return {
    newState: {
      ...state,
      ...dimensions,
    },
    commands: [],
  }
}
