export const closeTabsLeft = (state) => {
  const commands = []
  if (state.focusedIndex <= state.activeIndex) {
    // view is kept the same, only tabs are closed
    commands.push(['Viewlet.send', /* id */ state.uid, /* method */ 'closeTabsLeft', /* index */ state.focusedIndex])
  } else {
    // view needs to be switched to focused index
    commands.push([/* Viewlet.send */ 'Viewlet.send', /* id */ state.uid, /* method */ 'closeTabsLeft', /* index */ state.focusedIndex])
  }
  return {
    newState: {
      ...state,
      editors: state.editors.slice(state.focusedIndex),
      activeIndex: state.focusedIndex,
    },
    commands,
  }
}
