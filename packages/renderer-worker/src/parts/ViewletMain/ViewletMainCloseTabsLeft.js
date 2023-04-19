import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const closeTabsLeft = async (state) => {
  if (state.focusedIndex <= state.activeIndex) {
    // view is kept the same, only tabs are closed
    await RendererProcess.invoke(/* Viewlet.send */ 'Viewlet.send', /* id */ state.uid, /* method */ 'closeTabsLeft', /* index */ state.focusedIndex)
  } else {
    // view needs to be switched to focused index
    await RendererProcess.invoke(/* Viewlet.send */ 'Viewlet.send', /* id */ state.uid, /* method */ 'closeTabsLeft', /* index */ state.focusedIndex)
  }
  state.editors = state.editors.slice(state.focusedIndex)
  state.activeIndex = state.focusedIndex
}
