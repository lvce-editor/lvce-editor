import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const closeOthers = async (state) => {
  if (state.focusedIndex === state.activeIndex) {
    // view is kept the same, only tabs are closed
    await RendererProcess.invoke(
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ state.uid,
      /* method */ 'closeOthers',
      /* keepIndex */ state.focusedIndex,
      /* focusIndex */ state.focusedIndex
    )
  } else {
    // view needs to be switched to focused index
    await RendererProcess.invoke(
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ state.uid,
      /* method */ 'closeOthers',
      /* keepIndex */ state.focusedIndex,
      /* focusIndex */ state.focusedIndex
    )
  }
  state.editors = [state.editors[state.focusedIndex]]
  state.activeIndex = 0
  state.focusedIndex = 0
}
