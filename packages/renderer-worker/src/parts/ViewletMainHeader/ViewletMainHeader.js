export const create = () => {
  return {}
}

export const loadContent = (state) => {
  return {
    ...state,
    editors: [
      {
        uri: 'new-file.txt',
        label: 'new-file.txt',
      },
    ],
  }
}

const renderTabs = {
  isEqual(oldState, newState) {
    return oldState.editors === newState.editors
  },
  apply(oldState, newState) {
    return [
      /* method */ 'setTabs',
      /* editors */ newState.editors,
      /* focusIndex */ newState.selectedIndex,
    ]
  },
}

export const render = [renderTabs]
