export const create = () => {
  return {
    tabs: [],
    selectedIndex: -1,
  }
}

export const loadContent = (state) => {
  return state
}

export const hasFunctionalRender = true

const renderTabs = {
  isEqual(oldState, newState) {
    return oldState.views === newState.views
  },
  apply(oldState, newState) {
    return [/* method */ 'setTabs', /* tabs */ newState.views]
  },
}

const renderSelectedIndex = {
  isEqual(oldState, newState) {
    return oldState.selectedIndex === newState.selectedIndex
  },
  apply(oldState, newState) {
    return [
      /* method */ 'setSelectedIndex',
      /* unFocusIndex */ oldState.selectedIndex,
      /* focusIndex */ newState.selectedIndex,
    ]
  },
}

export const render = [renderTabs, renderSelectedIndex]
