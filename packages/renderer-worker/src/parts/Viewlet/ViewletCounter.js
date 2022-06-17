export const name = 'Counter'

export const create = () => {
  return {
    count: 0,
    disposed: false,
  }
}

export const increment = (state) => {
  return {
    ...state,
    count: state.count + 1,
  }
}

export const decrement = (state) => {
  return {
    ...state,
    count: state.count - 1,
  }
}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

export const hasFunctionalRender = true

export const render = (oldState, newState) => {
  const changes = []
  if (oldState.count !== newState.count) {
    changes.push([
      /* Viewlet.send */ 3024,
      /* id */ 'Counter',
      /* method */ 'setCount',
      /* newCount */ newState.count,
    ])
  }
  return changes
}
