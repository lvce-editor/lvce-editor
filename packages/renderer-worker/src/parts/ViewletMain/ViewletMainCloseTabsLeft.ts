import type { MainState } from './ViewletMainTypes.ts'

export const closeTabsLeft = (state: MainState) => {
  const commands: any[] = []
  // @ts-ignore
  if (state.focusedIndex <= state.activeIndex) {
    // view is kept the same, only tabs are closed
    // @ts-ignore
    commands.push(['Viewlet.send', /* id */ state.uid, /* method */ 'closeTabsLeft', /* index */ state.focusedIndex])
  } else {
    // view needs to be switched to focused index
    // @ts-ignore
    commands.push([/* Viewlet.send */ 'Viewlet.send', /* id */ state.uid, /* method */ 'closeTabsLeft', /* index */ state.focusedIndex])
  }
  return {
    newState: {
      ...state,
      // @ts-ignore
      editors: state.editors.slice(state.focusedIndex),
      activeIndex: state.focusedIndex,
    },
    commands,
  }
}
