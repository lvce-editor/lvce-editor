export const closeOthers = (state) => {
  const { editors, focusedIndex, selectedIndex } = state
  if (editors.length === 0) {
    return {
      newState: state,
      commands: [],
    }
  }

  const newEditors = [editors[focusedIndex]]
  if (focusedIndex === selectedIndex) {
    // view is kept the same, only tabs are closed
    return {
      newState: {
        ...state,
        editors: newEditors,
        focusedIndex: 0,
        selectedIndex: 0,
      },
      commands: [],
    }
  }
  // view needs to be switched to focused index
  return {
    newState: {
      ...state,
      editors: newEditors,
      focusedIndex: 0,
      selectedIndex: 0,
    },
    commands: [], // TODO
  }
}
