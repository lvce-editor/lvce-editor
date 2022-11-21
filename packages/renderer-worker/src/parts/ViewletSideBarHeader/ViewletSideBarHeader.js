export const create = () => {
  return {
    title: '',
  }
}

export const loadContent = (state) => {
  return {
    ...state,
    title: 'Explorer',
  }
}

export const setProps = (state) => {
  return {
    ...state,
    title: 'Explorer',
  }
}

export const hasFunctionalRender = true

const renderTitle = {
  isEqual(oldState, newState) {
    return oldState.title === newState.title
  },
  apply(oldState, newState) {
    return [/* method */ 'setTitle', /* name */ newState.title]
  },
}

export const render = [renderTitle]
