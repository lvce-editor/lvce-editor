const renderStorage = {
  isEqual(oldState, newState) {
    return oldState.localStorage === newState.localStorage && oldState.sessionStorage === newState.sessionStorage
  },
  apply(oldState, newState) {
    return ['setStorage', newState.localStorage]
  },
}

export const hasFunctionalRender = true

export const render = [renderStorage]
