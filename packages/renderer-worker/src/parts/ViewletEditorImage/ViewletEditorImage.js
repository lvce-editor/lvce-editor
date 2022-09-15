export const name = 'EditorImage'

export const create = (id, uri, left, top, width, height) => {
  return {
    src: '',
    disposed: false,
    top,
    left,
    width,
    height,
    uri,
  }
}

export const loadContent = async (state, ...args) => {
  return {
    ...state,
    src: state.uri,
  }
}

export const contentLoaded = async (state) => {}

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
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ 'EditorImage',
      /* method */ 'setSrc',
      /* src */ `/remote${newState.src}`,
    ]
  },
}

export const render = [renderSrc]
