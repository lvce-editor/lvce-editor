export const name = 'ExtensionDetail'

export const create = () => {
  return {
    name: '',
  }
}

export const loadContent = (state) => {
  return {
    ...state,
    name: 'TODO display name here',
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
