import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const create = (id) => {
  return {
    disposed: false,
    id,
    src: '',
  }
}

export const loadContent = async (state, src) => {
  return {
    ...state,
    src,
  }
}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

export const hasFunctionalRender = true

const renderSrc = {
  isEqual(oldState, newState) {
    return oldState.src === newState.src
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'Iframe',
      /* method */ 'setSrc',
      /* src */ newState.src,
    ]
  },
}

export const render = [renderSrc]
