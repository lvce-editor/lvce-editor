import * as RenderMethod from '../RenderMethod/RenderMethod.js'

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

const renderCount = {
  isEqual(oldState, newState) {
    return oldState.count === newState.count
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetCount, /* newCount */ newState.count]
  },
}

export const render = [renderCount]
