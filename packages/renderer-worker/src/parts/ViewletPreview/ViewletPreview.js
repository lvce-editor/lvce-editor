import * as RenderMethod from '../RenderMethod/RenderMethod.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const create = (uid) => {
  return {
    count: 0,
    disposed: false,
    uid,
  }
}
export const loadContent = (state) => {
  return {
    ...state,
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
export const hasFunctionalEvents = true

const renderDom = {
  isEqual(oldState, newState) {
    console.log('is eq prev')
    return oldState === newState
  },
  apply(oldState, newState) {
    console.log('render prev')
    return [
      'Viewlet.setDom2',
      [
        {
          type: VirtualDomElements.Div,
          className: 'Viewlet Preview',
          childCount: 1,
        },
        text('Hello world'),
      ],
    ]
  },
}

export const render = [renderDom]

export const Css = ['/css/parts/Preview.css']
