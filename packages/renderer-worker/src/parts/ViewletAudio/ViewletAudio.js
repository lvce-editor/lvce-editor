import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const create = (id, uri) => {
  return {
    src: '',
    uri,
  }
}

export const loadContent = (state) => {
  // TODO get src from uri
  const { uri } = state
  const src = '/remote' + uri
  return {
    ...state,
    src,
  }
}

export const hasFunctionalRender = true

export const renderSrc = {
  isEqual(oldState, newState) {
    return oldState.src === newState.src
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ ViewletModuleId.Audio,
      /* method */ 'setSrc',
      /* src */ newState.src,
    ]
  },
}

export const render = [renderSrc]
