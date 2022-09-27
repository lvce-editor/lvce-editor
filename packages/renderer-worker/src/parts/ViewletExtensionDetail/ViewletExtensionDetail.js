export const name = 'ExtensionDetail'

export const create = (id, uri) => {
  return {
    name: '',
    uri,
  }
}

export const loadContent = (state) => {
  const { uri } = state
  const id = uri.slice('extension-detail://'.length)
  console.log({ state })
  return {
    ...state,
    name: id,
  }
}

export const hasFunctionalRender = true

const renderName = {
  isEqual(oldState, newState) {
    return oldState.name === newState.name
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'ExtensionDetail',
      /* method */ 'setName',
      /* name */ newState.name,
    ]
  },
}

export const render = [renderName]
