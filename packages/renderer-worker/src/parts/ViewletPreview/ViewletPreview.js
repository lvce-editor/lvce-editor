import * as RenderMethod from '../RenderMethod/RenderMethod.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

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
export const hasFunctionalRootRender = true
export const hasFunctionalResize = true

const renderDom = {
  isEqual(oldState, newState) {
    return oldState.count === newState.count
  },
  apply(oldState, newState) {
    return [
      /* method */ RenderMethod.SetDom,
      newState.uid,
      [
        {
          type: VirtualDomElements.Div,
          childCount: 1,
        },
        text('Hello world'),
      ],
    ]
  },
}

export const render = [renderDom]
