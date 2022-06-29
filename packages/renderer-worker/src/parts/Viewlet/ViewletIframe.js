export const name = 'Iframe'

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
      /* Viewlet.send */ 3024,
      /* id */ 'Iframe',
      /* method */ 'setSrc',
      /* src */ newState.src,
    ])
  }
  return changes
}

export const renderVirtualDom = (oldState, newState) => {
  const changes = []
  changes.push([
    [
      /* renderVirtualDom */ 1,
      /* id */ 12,
      /* parentId */ 11,
      /* tagName */ 'iframe',
      /* props */ {
        className: 'Viewlet',
        'data-viewlet-id': 'Iframe',
        src: newState.src,
      },
    ],
  ])
  return changes
}
