export const name = 'EditorImage'

export const create = (id, uri, left, top, width, height) => {
  return {
    src: '',
    disposed: false,
  }
}

export const loadContent = async (state) => {
  return {
    ...state,
    src: 'abc',
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

export const render = (oldState, newState) => {
  const changes = []
  if (oldState.src !== newState.src) {
    changes.push([
      /* Viewlet.invoke */ 'Viewlet.send',
      /* id */ 'EditorImage',
      /* method */ 'setSrc',
      /* src */ `/remote${newState.src}`,
    ])
  }
  return changes
}
