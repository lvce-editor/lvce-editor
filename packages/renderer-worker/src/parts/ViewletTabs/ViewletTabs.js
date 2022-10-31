const renderTabs = {
  isEqual(oldState, newState) {
    return false
  },
  apply(oldState, newState) {
    // TODO
    return []
  },
}

const renderSelectedIndex = {
  isEqual(oldState, newState) {
    return oldState.selectedIndex === newState.selectedIndex
  },
  apply(oldState, newState) {
    // TODO
    return []
  },
}

export const render = [renderTabs, renderSelectedIndex]
